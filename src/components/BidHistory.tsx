
import React from 'react';
import { Auction, Bid } from '@/types/auction';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDate } from '@/utils/dateUtils';

interface BidHistoryProps {
  auction: Auction;
}

const BidHistory: React.FC<BidHistoryProps> = ({ auction }) => {
  // Sort bids from newest to oldest
  const sortedBids = [...auction.bids].sort((a, b) => {
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });
  
  const getBidStatus = (bid: Bid) => {
    if (auction.status === 'active' && bid.amount === auction.currentBid) {
      return 'Highest bid';
    } else if (auction.status === 'ended' && bid.amount === auction.currentBid) {
      return 'Winning bid';
    }
    return 'Outbid';
  };
  
  const getBidStatusClass = (bid: Bid) => {
    if (auction.status === 'active' && bid.amount === auction.currentBid) {
      return 'text-green-600 font-medium';
    } else if (auction.status === 'ended' && bid.amount === auction.currentBid) {
      return 'text-auction-purple font-medium';
    }
    return 'text-gray-500';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Bid History</CardTitle>
      </CardHeader>
      
      <CardContent>
        {sortedBids.length === 0 ? (
          <p className="text-muted-foreground text-center py-6">
            No bids have been placed yet.
          </p>
        ) : (
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-3">
              {sortedBids.map((bid) => (
                <div 
                  key={bid.id}
                  className="bg-muted/50 p-3 rounded-md"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">
                      {bid.bidder.split('@')[0]}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {formatDate(bid.timestamp)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center mt-2">
                    <span className="font-bold text-lg">
                      ${bid.amount.toFixed(2)}
                    </span>
                    <span className={`text-sm ${getBidStatusClass(bid)}`}>
                      {getBidStatus(bid)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

export default BidHistory;
