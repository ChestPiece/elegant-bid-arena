
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Auction } from '@/types/auction';
import { formatTimeLeft } from '@/utils/dateUtils';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

interface AuctionCardProps {
  auction: Auction;
}

const AuctionCard: React.FC<AuctionCardProps> = ({ auction }) => {
  const [timeLeft, setTimeLeft] = useState(formatTimeLeft(auction.endDate));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (auction.status === 'ended') return;
    
    const timer = setInterval(() => {
      setTimeLeft(formatTimeLeft(auction.endDate));
      if (new Date() > auction.endDate) {
        clearInterval(timer);
      }
    }, 1000);
    
    return () => clearInterval(timer);
  }, [auction.endDate, auction.status]);

  const getBadgeColor = () => {
    if (auction.status === 'active') {
      return 'bg-green-100 text-green-800 hover:bg-green-100';
    } else if (auction.status === 'ended') {
      return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
    return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
  };
  
  const isEnding = () => {
    if (auction.status !== 'active') return false;
    const now = new Date();
    const diff = auction.endDate.getTime() - now.getTime();
    // Less than 1 hour remaining
    return diff > 0 && diff < 1000 * 60 * 60;
  };

  return (
    <Card className="overflow-hidden h-full flex flex-col transition-all duration-200 hover:shadow-md">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={auction.imageUrl} 
          alt={auction.title}
          className="w-full h-full object-cover"
        />
        <Badge 
          className={`absolute top-2 right-2 ${getBadgeColor()}`}
        >
          {auction.status.charAt(0).toUpperCase() + auction.status.slice(1)}
        </Badge>
      </div>
      
      <CardContent className="pt-4 flex-grow">
        <h3 className="text-lg font-semibold line-clamp-1">{auction.title}</h3>
        <p className="text-muted-foreground text-sm line-clamp-2 mt-1">
          {auction.description}
        </p>
        
        <div className="mt-4">
          <div className="flex justify-between items-center text-sm">
            <span className="font-medium">Current Bid:</span>
            <span className="font-bold">
              {auction.currentBid 
                ? `$${auction.currentBid.toFixed(2)}` 
                : `$${auction.startingPrice.toFixed(2)} (Starting)`}
            </span>
          </div>
          
          <div className="flex justify-between items-center mt-2 text-sm">
            <span className="font-medium">Bids:</span>
            <span>{auction.bids.length}</span>
          </div>
          
          <div className="flex justify-between items-center mt-2 text-sm">
            <span className="font-medium">Time Left:</span>
            <span className={`font-medium ${isEnding() ? 'timer-active animate-pulse-light' : ''}`}>
              {timeLeft}
            </span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-0 pb-4">
        <Button 
          className="w-full"
          variant={auction.status === 'active' ? 'default' : 'secondary'}
          asChild
          disabled={loading}
        >
          {loading ? (
            <div>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading...
            </div>
          ) : (
            <Link to={`/auctions/${auction.id}`}>
              {auction.status === 'active' 
                ? 'Place Bid' 
                : auction.status === 'ended' 
                ? 'View Results' 
                : 'View Details'}
            </Link>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AuctionCard;
