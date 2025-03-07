export interface MarketData {
  marketCap: number;
  price: number;
  tvl: number;
  trustScore: number;
  sentimentScore: number;
  raw_data: string
}

export interface TelegramMessage {
  id: string;
  content: string;
  timestamp: string;
  author: string;
}

export interface TwitterPost {
  id: string;
  content: string;
  metrics: {
    likes: number;
    reposts: number;
    views: number;
    verifiedComments: number;
  };
  timestamp: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  url: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  timestamp: string;
}