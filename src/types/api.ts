export interface CoinListItem {
  id: string;
  symbol: string;
  name: string;
  market_cap?: number;
}
export interface CoinGeckoResponse {
  [coinId: string]: {
    usd: number;
    usd_market_cap: number;
    usd_24h_vol: number;
    usd_24h_change: number;
    last_updated_at: number;
  };
}
// This is for the --url https://api.coingecko.com/api/v3/coins/markets \ command. Comes with a lot more information
// export interface CoinGeckoResponse {
//   id: string;
//   symbol: string;
//   name: string;
//   sentiment_votes_up_percentage: number;
//   sentiment_votes_down_percentage: number;
//   market_data: {
//     current_price: {
//       usd: number;
//     };
//     market_cap: {
//       usd: number;
//     };
//     total_volume: {
//       usd: number;
//     };
//   };
//   community_data: {
//     twitter_followers: number;
//     reddit_subscribers: number;
//     telegram_channel_user_count: number | null;
//   };
//   developer_data: {
//     forks: number;
//     stars: number;
//     subscribers: number;
//     total_issues: number;
//     closed_issues: number;
//     pull_requests_merged: number;
//     pull_request_contributors: number;
//   };
// }

export interface SearchResult {
  id: string;
  symbol: string;
  name: string;
  type: 'id' | 'symbol' | 'name';
  market_cap?: number;  // Add this field
}