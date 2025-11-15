
import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { PriceChart } from './components/PriceChart';
import { Controls } from './components/Controls';
import { Results } from './components/Results';
import { fetchPrediction } from './services/geminiService';
import { MOCK_DATA } from './constants';
import type { HistoricalPrice, PredictionResult, AssetId } from './types';

const App: React.FC = () => {
  const [selectedAsset, setSelectedAsset] = useState<AssetId>('TECH_STOCK');
  const [supplyIndicator, setSupplyIndicator] = useState<string>('150000000');
  const [demandIndicator, setDemandIndicator] = useState<string>('210000');
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [actualClose, setActualClose] = useState<string>('');
  const [rmse, setRmse] = useState<number | null>(null);

  const historicalData: HistoricalPrice[] = useMemo(() => MOCK_DATA[selectedAsset], [selectedAsset]);

  useEffect(() => {
    // Reset prediction and errors when asset changes
    setPrediction(null);
    setError(null);
    setActualClose('');
    setRmse(null);
  }, [selectedAsset]);

  const handlePredict = async () => {
    setIsLoading(true);
    setError(null);
    setPrediction(null);
    setRmse(null);

    const supply = parseFloat(supplyIndicator);
    const demand = parseFloat(demandIndicator);

    if (isNaN(supply) || isNaN(demand)) {
        setError("Please enter valid numbers for supply and demand indicators.");
        setIsLoading(false);
        return;
    }

    try {
      const result = await fetchPrediction(historicalData, supply, demand);
      setPrediction(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCalculateRmse = () => {
      const actual = parseFloat(actualClose);
      if (prediction && !isNaN(actual)) {
          const predicted = prediction.prediction;
          const squaredError = Math.pow(predicted - actual, 2);
          const rootMeanSquaredError = Math.sqrt(squaredError);
          setRmse(rootMeanSquaredError);
      } else {
          setRmse(null);
      }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-gray-800/50 rounded-lg shadow-xl p-6 flex flex-col space-y-6 h-fit">
            <Controls
              selectedAsset={selectedAsset}
              setSelectedAsset={setSelectedAsset}
              supplyIndicator={supplyIndicator}
              setSupplyIndicator={setSupplyIndicator}
              demandIndicator={demandIndicator}
              setDemandIndicator={setDemandIndicator}
              handlePredict={handlePredict}
              isLoading={isLoading}
              actualClose={actualClose}
              setActualClose={setActualClose}
              handleCalculateRmse={handleCalculateRmse}
              predictionMade={!!prediction}
            />
          </div>

          <div className="lg:col-span-2 flex flex-col space-y-6">
            <div className="bg-gray-800/50 rounded-lg shadow-xl p-6 h-[400px] md:h-[500px]">
              <PriceChart historicalData={historicalData} prediction={prediction?.prediction ?? null} assetName={MOCK_DATA[selectedAsset][0].name} />
            </div>
            <div className="bg-gray-800/50 rounded-lg shadow-xl p-6 min-h-[150px]">
              <Results
                isLoading={isLoading}
                error={error}
                prediction={prediction}
                rmse={rmse}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
