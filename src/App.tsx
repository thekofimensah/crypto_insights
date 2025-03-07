import { useState } from 'react';
import { SearchInput } from './components/SearchBar/SearchInput';
import { Dashboard } from './components/Dashboard/Dashboard';
import { TelegramFeed } from './components/SocialFeed/TelegramFeed';
import { TwitterFeed } from './components/SocialFeed/TwitterFeed';
import { NewsFeed } from './components/News/NewsFeed';
import { useCoinData } from './hooks/useCoinData';

function App() {
  const [selectedCoinId, setSelectedCoinId] = useState<string | null>(null);
  const { data, isLoading, error } = useCoinData(selectedCoinId);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Crypto Intelligence Dashboard</h1>
        
        <div className="mb-8">
          <SearchInput onSearch={setSelectedCoinId} />
        </div>

        {isLoading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-8">
            {error}
          </div>
        )}

        {data && (
          <>
            <div className="mb-8">
              <Dashboard data={data} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <TelegramFeed messages={[]} />
              <TwitterFeed posts={[]} />
              <NewsFeed articles={[]} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;