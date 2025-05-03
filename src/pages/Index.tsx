
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAuctions, filterAuctionsByStatus } from '@/services/auctionService';
import AuctionCard from '@/components/AuctionCard';
import AuctionFilters from '@/components/AuctionFilters';
import { Loader2 } from 'lucide-react';
import EmptyState from '@/components/EmptyState';

const IndexPage: React.FC = () => {
  const [statusFilter, setStatusFilter] = React.useState<'all' | 'active' | 'ended' | 'upcoming'>('all');
  
  const { data: auctions, isLoading, error } = useQuery({
    queryKey: ['auctions'],
    queryFn: getAuctions,
  });
  
  const filteredAuctions = auctions ? filterAuctionsByStatus(auctions, statusFilter) : [];
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome to AuctionMaster</h1>
        <p className="text-muted-foreground">
          Discover unique items and place your bids before time runs out!
        </p>
      </div>
      
      <AuctionFilters filter={statusFilter} onChange={setStatusFilter} />
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 text-auction-purple animate-spin" />
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4">
          An error occurred while loading auctions. Please try again.
        </div>
      ) : filteredAuctions.length === 0 ? (
        <EmptyState
          title="No auctions found"
          description={`There are currently no ${statusFilter !== 'all' ? statusFilter : ''} auctions available.`}
          actionLabel="Create an Auction"
          actionLink="/create"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAuctions.map((auction) => (
            <AuctionCard key={auction.id} auction={auction} />
          ))}
        </div>
      )}
    </div>
  );
};

export default IndexPage;
