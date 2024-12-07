import { useState, useEffect } from 'react';
import { fetchCoinData } from '../services/api';
import type { MarketData } from '../types';
import type { CoinGeckoResponse } from '../types/api';

export function useCoinData(coinId: string | null) {
  const [data, setData] = useState<MarketData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!coinId) {
      setData(null);
      setError(null);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetchCoinData(coinId);
        
        if (!response[coinId]?.usd || 
            !response[coinId]?.usd_market_cap || 
            !response[coinId]?.usd_24h_vol) {
          throw new Error('Invalid market data received');
        }
      
        // Calculate trust score based on developer metrics
        const devScore = calculateDevScore(response.developer_data);
        
        // Calculate sentiment score
        const sentimentScore = response.sentiment_votes_up_percentage ?? 50;
        
        // Calculate social score based on community metrics
        const socialScore = calculateSocialScore(response.community_data);
      
        setData({
          raw_data: coinId,
          marketCap: response[coinId].usd_market_cap,
          price: response[coinId].usd,
          tvl: response[coinId].usd_24h_vol,
          trustScore: Math.round((devScore + socialScore) / 2),
          sentimentScore: sentimentScore
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch coin data');
        console.error('Error fetching coin data:', err);
        setData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [coinId]);

  return { data, isLoading, error };
}

function calculateDevScore(devData: CoinGeckoResponse['developer_data']): number {
  const metrics = {
    forks: normalize(devData?.forks ?? 0, 0, 50000),
    stars: normalize(devData?.stars ?? 0, 0, 100000),
    issues: normalize(devData?.closed_issues ?? 0 / (devData?.total_issues || 1), 0, 1),
    prs: normalize(devData?.pull_requests_merged ?? 0, 0, 10000),
    contributors: normalize(devData?.pull_request_contributors ?? 0, 0, 1000)
  };

  return Math.round(
    (metrics.forks * 0.2 + 
     metrics.stars * 0.3 + 
     metrics.issues * 0.2 + 
     metrics.prs * 0.15 + 
     metrics.contributors * 0.15) * 100
  );
}

function calculateSocialScore(communityData: CoinGeckoResponse['community_data']): number {
  const metrics = {
    twitter: normalize(communityData?.twitter_followers ?? 0, 0, 5000000),
    reddit: normalize(communityData?.reddit_subscribers ?? 0, 0, 5000000),
    telegram: normalize(communityData?.telegram_channel_user_count ?? 0, 0, 500000)
  };

  return Math.round(
    (metrics.twitter * 0.4 + 
     metrics.reddit * 0.4 + 
     metrics.telegram * 0.2) * 100
  );
}

function normalize(value: number, min: number, max: number): number {
  return Math.min(Math.max((value - min) / (max - min), 0), 1);
}