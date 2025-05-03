
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getMyBids, filterAuctionsByStatus } from '@/services/auctionService';
import AuctionCard from '@/components/AuctionCard';
import AuctionFilters from '@/components/AuctionFilters';
import { Loader2 } from 'lucide-react';
import EmptyState from '@/components/EmptyState';

const MyBidsPage: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'ended' | 'upcoming'>('all');
  
  const { data: auctionsWithMyBids, isLoading } = useQuery({
    queryKey: ['my-bids'],
    queryFn: getMyBids,
  });
  
  const filteredAuctions = auctionsWithMyBids 
    ? filterAuctionsByStatus(auctionsWithMyBids, statusFilter) 
    : [];
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Bids</h1>
        <p className="text-muted-foreground">
          Track auctions you've participated in
        </p>
      </div>
      
      <AuctionFilters filter={statusFilter} onChange={setStatusFilter} />
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 text-auction-purple animate-spin" />
        </div>
      ) : filteredAuctions.length === 0 ? (
        <EmptyState
          title="No bids found"
          description={`You haven't placed bids on any ${statusFilter !== 'all' ? statusFilter : ''} auctions yet.`}
          actionLabel="Browse Auctions"
          actionLink="/"
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

export default MyBidsPage;
