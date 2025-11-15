
export interface HistoricalPrice {
  name: string;
  date: string;
  open: number;
  close: number;
  volume: number;
}

export interface PredictionResult {
  prediction: number;
  reasoning: string;
}

export type AssetId = 'TECH_STOCK' | 'COMMODITY_GOLD' | 'CRYPTO_BTC';

export interface MockData {
    [key: string]: HistoricalPrice[];
}
