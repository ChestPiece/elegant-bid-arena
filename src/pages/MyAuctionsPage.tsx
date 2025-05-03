
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getMyAuctions, filterAuctionsByStatus } from '@/services/auctionService';
import AuctionCard from '@/components/AuctionCard';
import AuctionFilters from '@/components/AuctionFilters';
import { Button } from '@/components/ui/button';
import { Loader2, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import EmptyState from '@/components/EmptyState';

const MyAuctionsPage: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'ended' | 'upcoming'>('all');
  
  const { data: myAuctions, isLoading } = useQuery({
    queryKey: ['my-auctions'],
    queryFn: getMyAuctions,
  });
  
  const filteredAuctions = myAuctions ? filterAuctionsByStatus(myAuctions, statusFilter) : [];
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Auctions</h1>
          <p className="text-muted-foreground">
            Manage auctions you've created
          </p>
        </div>
        
        <Button asChild className="bg-auction-purple hover:bg-auction-purple-dark">
          <Link to="/create" className="flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            New Auction
          </Link>
        </Button>
      </div>
      
      <AuctionFilters filter={statusFilter} onChange={setStatusFilter} />
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 text-auction-purple animate-spin" />
        </div>
      ) : filteredAuctions.length === 0 ? (
        <EmptyState
          title="No auctions found"
          description={`You don't have any ${statusFilter !== 'all' ? statusFilter : ''} auctions yet.`}
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

export default MyAuctionsPage;
