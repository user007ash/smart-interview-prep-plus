
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.33.1"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Get the request data
    const formData = await req.formData()
    const audioFile = formData.get('audio') as File
    const questionText = formData.get('question') as string
    const authorization = req.headers.get('Authorization') || ''

    if (!audioFile) {
      throw new Error('No audio file provided')
    }

    if (!questionText) {
      throw new Error('No question text provided')
    }

    // Create a Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || ''
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ''
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Get user from JWT token
    const jwt = authorization.replace('Bearer ', '')
    const { data: { user }, error: userError } = await supabase.auth.getUser(jwt)

    if (userError || !user) {
      throw new Error('Unauthorized: ' + (userError?.message || 'No user found'))
    }

    // Create a folder path with user ID
    const userId = user.id
    const timestamp = new Date().getTime()
    const fileExt = audioFile.name.split('.').pop()
    const filePath = `${userId}/${timestamp}.${fileExt}`

    // Upload the audio file to Supabase Storage
    const { data: storageData, error: storageError } = await supabase
      .storage
      .from('interview_audio')
      .upload(filePath, audioFile, {
        contentType: audioFile.type
      })

    if (storageError) {
      throw new Error('Storage upload failed: ' + storageError.message)
    }

    // Get the public URL
    const { data: { publicUrl } } = supabase
      .storage
      .from('interview_audio')
      .getPublicUrl(filePath)

    // Store the answer metadata in the database
    const { data: answerData, error: answerError } = await supabase
      .from('user_answers')
      .insert({
        user_id: userId,
        question: questionText,
        audio_url: publicUrl,
        transcript: formData.get('transcript') || null
      })
      .select()

    if (answerError) {
      throw new Error('Database insert failed: ' + answerError.message)
    }

    // Return success response
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Audio uploaded successfully',
        audioUrl: publicUrl,
        answerId: answerData[0].id
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    )
  } catch (error) {
    console.error('Audio upload error:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        status: 400,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})
