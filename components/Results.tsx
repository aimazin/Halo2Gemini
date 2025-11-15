
import React from 'react';
import type { PredictionResult } from '../types';
import { LoadingSpinnerIcon } from './icons/LoadingSpinnerIcon';
import { LightBulbIcon } from './icons/LightBulbIcon';
import { ExclamationIcon } from './icons/ExclamationIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';

interface ResultsProps {
  isLoading: boolean;
  error: string | null;
  prediction: PredictionResult | null;
  rmse: number | null;
}

export const Results: React.FC<ResultsProps> = ({ isLoading, error, prediction, rmse }) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400">
        <LoadingSpinnerIcon className="h-10 w-10 animate-spin text-cyan-500" />
        <p className="mt-4 text-lg">Communicating with financial models...</p>
        <p className="text-sm">Please wait while Gemini processes the data.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-red-400 bg-red-900/20 rounded-lg p-4">
        <ExclamationIcon className="h-8 w-8 mr-3" />
        <div>
          <h3 className="font-bold">Prediction Failed</h3>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!prediction) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400">
        <LightBulbIcon className="h-10 w-10 text-yellow-400" />
        <p className="mt-4 text-lg">Awaiting Prediction</p>
        <p className="text-sm">Configure your parameters and press "Predict".</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row md:space-x-6 space-y-4 md:space-y-0">
      <div className="flex-1">
        <h2 className="text-lg font-semibold text-cyan-400 mb-2">Forecast Result</h2>
        <div className="bg-gray-700/50 p-4 rounded-lg">
          <p className="text-sm text-gray-400">Predicted Close Price</p>
          <p className="text-3xl lg:text-4xl font-bold text-yellow-300">
            ${prediction.prediction.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
        {rmse !== null && (
          <div className="mt-4 bg-gray-700/50 p-4 rounded-lg flex items-center">
            <CheckCircleIcon className="h-6 w-6 text-green-400 mr-3" />
            <div>
              <p className="text-sm text-gray-400">Root Mean Square Error (RMSE)</p>
              <p className="text-xl font-semibold text-green-300">{rmse.toFixed(4)}</p>
            </div>
          </div>
        )}
      </div>
      <div className="flex-1">
        <h2 className="text-lg font-semibold text-cyan-400 mb-2">Model Reasoning</h2>
        <div className="text-sm text-gray-300 bg-gray-900/30 p-4 rounded-lg h-full">
          <p>{prediction.reasoning}</p>
        </div>
      </div>
    </div>
  );
};
