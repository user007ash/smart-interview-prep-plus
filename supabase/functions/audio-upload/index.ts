
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.33.1"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

/**
 * Handle CORS preflight requests
 */
const handleCORS = () => {
  return new Response(null, { headers: corsHeaders });
};

/**
 * Error response helper
 */
const errorResponse = (message: string, status = 400) => {
  return new Response(
    JSON.stringify({ 
      success: false, 
      error: message 
    }),
    { 
      status, 
      headers: { 
        ...corsHeaders,
        'Content-Type': 'application/json' 
      } 
    }
  );
};

/**
 * Success response helper
 */
const successResponse = (data: Record<string, unknown>) => {
  return new Response(
    JSON.stringify({ 
      success: true, 
      ...data
    }),
    { 
      headers: { 
        ...corsHeaders,
        'Content-Type': 'application/json' 
      } 
    }
  );
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return handleCORS();
  }

  try {
    // Get the request data
    const formData = await req.formData();
    const audioFile = formData.get('audio') as File;
    const questionText = formData.get('question') as string;
    const authorization = req.headers.get('Authorization') || '';

    // Input validation
    if (!audioFile) {
      return errorResponse('No audio file provided');
    }

    if (!questionText) {
      return errorResponse('No question text provided');
    }

    if (!authorization) {
      return errorResponse('Authorization token is required', 401);
    }

    // Create a Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!supabaseUrl || !supabaseKey) {
      return errorResponse('Server configuration error', 500);
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user from JWT token
    const jwt = authorization.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(jwt);

    if (userError || !user) {
      return errorResponse('Unauthorized: ' + (userError?.message || 'Auth session missing!'), 401);
    }

    // Create a folder path with user ID
    const userId = user.id;
    const timestamp = new Date().getTime();
    const fileExt = audioFile.name.split('.').pop();
    const filePath = `${userId}/${timestamp}.${fileExt}`;

    // Upload the audio file to Supabase Storage
    const { data: storageData, error: storageError } = await supabase
      .storage
      .from('interview_audio')
      .upload(filePath, audioFile, {
        contentType: audioFile.type,
        cacheControl: '3600'
      });

    if (storageError) {
      console.error('Storage upload error:', storageError);
      return errorResponse('Storage upload failed: ' + storageError.message, 500);
    }

    // Get the public URL
    const { data: { publicUrl } } = supabase
      .storage
      .from('interview_audio')
      .getPublicUrl(filePath);

    // Store the answer metadata in the database
    const { data: answerData, error: answerError } = await supabase
      .from('user_answers')
      .insert({
        user_id: userId,
        question: questionText,
        audio_url: publicUrl,
        transcript: formData.get('transcript') || null
      })
      .select();

    if (answerError) {
      console.error('Database insert error:', answerError);
      return errorResponse('Database insert failed: ' + answerError.message, 500);
    }

    // Return success response
    return successResponse({ 
      message: 'Audio uploaded successfully',
      audioUrl: publicUrl,
      answerId: answerData[0].id
    });
  } catch (error) {
    console.error('Audio upload error:', error);
    return errorResponse(error.message || 'Unknown error occurred', 500);
  }
});
