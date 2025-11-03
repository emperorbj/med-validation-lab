import React from 'react';
import { CheckCircle, Circle } from 'lucide-react';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  currentStep,
  totalSteps,
}) => {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      {/* Progress Bar */}
      <div className="relative">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Step Indicators */}
        <div className="flex justify-between mt-4">
          {Array.from({ length: totalSteps }, (_, index) => {
            const stepNumber = index + 1;
            const isComplete = stepNumber < currentStep;
            const isCurrent = stepNumber === currentStep;

            return (
              <div key={stepNumber} className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                    isComplete
                      ? 'bg-green-500 border-green-500 text-white'
                      : isCurrent
                      ? 'bg-blue-500 border-blue-500 text-white animate-pulse'
                      : 'bg-white border-gray-300 text-gray-400'
                  }`}
                >
                  {isComplete ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-semibold">{stepNumber}</span>
                  )}
                </div>
                <span
                  className={`text-xs mt-2 font-medium ${
                    isComplete || isCurrent ? 'text-gray-900' : 'text-gray-400'
                  }`}
                >
                  Step {stepNumber}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Progress Text */}
      <div className="text-center mt-4">
        <p className="text-sm text-gray-600">
          <span className="font-semibold text-gray-900">{currentStep}</span> of{' '}
          <span className="font-semibold text-gray-900">{totalSteps}</span> steps
          completed
        </p>
        <p className="text-xs text-gray-500 mt-1">
          {progress === 100
            ? '🎉 All steps complete!'
            : `${Math.round(progress)}% complete`}
        </p>
      </div>
    </div>
  );
};