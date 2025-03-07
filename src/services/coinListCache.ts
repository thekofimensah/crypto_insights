import { fetchCoinList } from './api';
import type { CoinListItem } from '../types/api';

class CoinListCache {
  private coins: CoinListItem[] = [];
  private lastUpdate: number = 0;
  private readonly CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

  private shouldRefreshCache(): boolean {
    return this.coins.length === 0 || 
           Date.now() - this.lastUpdate > this.CACHE_DURATION;
  }

  private saveCacheToLocalStorage(): void {
    try {
      localStorage.setItem('coinList', JSON.stringify({
        coins: this.coins,
        lastUpdate: this.lastUpdate
      }));
    } catch (error) {
      console.error('Failed to save cache:', error);
    }
  }

  private loadCacheFromLocalStorage(): void {
    try {
      const cached = localStorage.getItem('coinList');
      if (cached) {
        const { coins, lastUpdate } = JSON.parse(cached);
        this.coins = coins;
        this.lastUpdate = lastUpdate;
      }
    } catch (error) {
      console.error('Failed to load cache:', error);
    }
  }

  async getCoinList(): Promise<CoinListItem[]> {
    if (this.shouldRefreshCache()) {
      try {
        // Fetch basic coin list
        const basicList = await fetchCoinList();
        
        // Fetch top 250 coins by market cap
        const response = await fetch(
          'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1'
        );
        const marketData = await response.json();
        
        // Create a map of coin IDs to market caps
        const marketCapMap = new Map(
          marketData.map((coin: any) => [coin.id, coin.market_cap])
        );

        // Merge market cap data with basic list
        this.coins = basicList.map(coin => ({
          ...coin,
          market_cap: marketCapMap.get(coin.id) || 0
        }));

        this.lastUpdate = Date.now();
        this.saveCacheToLocalStorage();
      } catch (error) {
        console.error('Failed to fetch coin list:', error);
        this.loadCacheFromLocalStorage();
      }
    }
    return this.coins;
  }
}

export const coinListCache = new CoinListCache();