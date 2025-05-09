
import React from 'react';
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';

const ScoreCard = ({ title, description, score, tooltipText }) => {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-lg font-medium">{title}</h2>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Info size={16} className="text-gray-400" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">{tooltipText}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <div className="flex justify-center">
        <div className="relative w-36 h-36">
          <svg className="circular-chart" viewBox="0 0 36 36">
            <path
              className="circle-bg"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              stroke="#EAEAEA"
            />
            <path
              className="circle"
              strokeDasharray={`${score}, 100`}
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              stroke={
                score >= 80 ? "#4CAF50" :
                score >= 60 ? "#FF9800" : "#F44336"
              }
            />
            <text x="18" y="20.35" className="score-text text-center font-bold text-3xl fill-current" style={{ dominantBaseline: 'middle', textAnchor: 'middle' }}>
              {score}%
            </text>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default ScoreCard;
