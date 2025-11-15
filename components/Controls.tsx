
import React from 'react';
import type { AssetId } from '../types';

interface ControlsProps {
  selectedAsset: AssetId;
  setSelectedAsset: (asset: AssetId) => void;
  supplyIndicator: string;
  setSupplyIndicator: (value: string) => void;
  demandIndicator: string;
  setDemandIndicator: (value: string) => void;
  handlePredict: () => void;
  isLoading: boolean;
  actualClose: string;
  setActualClose: (value: string) => void;
  handleCalculateRmse: () => void;
  predictionMade: boolean;
}

export const Controls: React.FC<ControlsProps> = ({
  selectedAsset,
  setSelectedAsset,
  supplyIndicator,
  setSupplyIndicator,
  demandIndicator,
  setDemandIndicator,
  handlePredict,
  isLoading,
  actualClose,
  setActualClose,
  handleCalculateRmse,
  predictionMade
}) => {
  return (
    <>
      <div>
        <h2 className="text-lg font-semibold text-cyan-400 mb-3">1. Select Asset</h2>
        <select
          value={selectedAsset}
          onChange={(e) => setSelectedAsset(e.target.value as AssetId)}
          className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        >
          <option value="TECH_STOCK">Innovate Inc. (INVT)</option>
          <option value="COMMODITY_GOLD">Gold (XAU/USD)</option>
          <option value="CRYPTO_BTC">Bitcoin (BTC/USD)</option>
        </select>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-cyan-400 mb-3">2. Economic Indicators</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="supply" className="block text-sm font-medium text-gray-300 mb-1">
              Supply Indicator (e.g., Trading Volume)
            </label>
            <input
              type="number"
              id="supply"
              value={supplyIndicator}
              onChange={(e) => setSupplyIndicator(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="e.g., 150000000"
            />
          </div>
          <div>
            <label htmlFor="demand" className="block text-sm font-medium text-gray-300 mb-1">
              Demand Indicator (e.g., Jobs Report)
            </label>
            <input
              type="number"
              id="demand"
              value={demandIndicator}
              onChange={(e) => setDemandIndicator(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="e.g., 210000"
            />
          </div>
        </div>
      </div>

      <div className="flex-grow"></div>

      <div className="space-y-4">
        <button
          onClick={handlePredict}
          disabled={isLoading}
          className="w-full bg-cyan-600 hover:bg-cyan-700 disabled:bg-cyan-800 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105"
        >
          {isLoading ? 'Forecasting...' : 'Predict Next Close Price'}
        </button>
        {predictionMade && (
            <div className="pt-4 border-t border-gray-700">
                <h2 className="text-lg font-semibold text-cyan-400 mb-3">3. Evaluate Prediction</h2>
                <div className="flex items-center space-x-2">
                    <input
                        type="number"
                        value={actualClose}
                        onChange={(e) => setActualClose(e.target.value)}
                        placeholder="Enter Actual Close Price"
                        className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                    <button
                        onClick={handleCalculateRmse}
                        disabled={!actualClose}
                        className="bg-gray-600 hover:bg-gray-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-md transition duration-300"
                    >
                        RMSE
                    </button>
                </div>
            </div>
        )}
      </div>
       <p className="text-xs text-gray-500 text-center mt-2">Note: This tool uses a simulated ML ensemble via Gemini for educational purposes.</p>
    </>
  );
};
