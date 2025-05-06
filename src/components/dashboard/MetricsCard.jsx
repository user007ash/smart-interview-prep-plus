
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';

const MetricsCard = ({ title, value, subtitle, trend = null, loading = false, tooltip = null }) => {
  return (
    <Card className="bg-white">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
              {tooltip && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="text-gray-400 hover:text-gray-600">
                        <Info className="h-4 w-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>{tooltip}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            {loading ? (
              <div className="h-8 w-24 bg-gray-200 animate-pulse rounded mt-2"></div>
            ) : (
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-bold">{value}</span>
                {trend !== null && (
                  <span className={`text-sm font-medium ${trend.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                    {trend.isPositive ? '+' : '-'}{trend.percentage}%
                  </span>
                )}
              </div>
            )}
          </div>
          {subtitle && <span className="text-sm text-gray-500">{subtitle}</span>}
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricsCard;
