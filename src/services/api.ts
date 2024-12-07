import axios from 'axios';
import type { CoinGeckoResponse, CoinListItem } from '../types/api';

const API_KEY = 'CG-peU4FUU92pAYpWYHQJ5hZ5xN';
const BASE_URL = 'https://api.coingecko.com/api/v3';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'accept': 'application/json',
    'x-cg-demo-api-key': API_KEY
  }
});

export async function fetchCoinList(): Promise<CoinListItem[]> {
  const response = await api.get<CoinListItem[]>('/coins/list');
  return response.data;
}

export async function fetchCoinData(id: string): Promise<CoinGeckoResponse> {
  const response = await api.get<CoinGeckoResponse>(
    `/simple/price?ids=${id}&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true&include_last_updated_at=true`
  );
  return response.data;
}