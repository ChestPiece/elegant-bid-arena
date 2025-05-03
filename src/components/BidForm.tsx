
import React, { useState } from 'react';
import { Auction } from '@/types/auction';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, AlertCircle } from 'lucide-react';
import { formatTimeLeft } from '@/utils/dateUtils';

interface BidFormProps {
  auction: Auction;
  onBidSubmit: (amount: number) => void;
  isSubmitting: boolean;
}

const BidForm: React.FC<BidFormProps> = ({ auction, onBidSubmit, isSubmitting }) => {
  const [bidAmount, setBidAmount] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<string>(formatTimeLeft(auction.endDate));
  
  React.useEffect(() => {
    if (auction.status !== 'active') return;
    
    const timer = setInterval(() => {
      const timeLeftStr = formatTimeLeft(auction.endDate);
      setTimeLeft(timeLeftStr);
      
      if (timeLeftStr === 'Auction ended') {
        clearInterval(timer);
      }
    }, 1000);
    
    return () => clearInterval(timer);
  }, [auction]);
  
  const isEnding = () => {
    if (auction.status !== 'active') return false;
    const now = new Date();
    const diff = auction.endDate.getTime() - now.getTime();
    // Less than 1 hour remaining
    return diff > 0 && diff < 1000 * 60 * 60;
  };
  
  const handleBidSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (auction.status !== 'active') {
      setError('This auction is no longer active.');
      return;
    }
    
    const amount = parseFloat(bidAmount);
    
    if (isNaN(amount) || amount <= 0) {
      setError('Please enter a valid bid amount.');
      return;
    }
    
    const minBid = auction.currentBid 
      ? auction.currentBid + 1
      : auction.startingPrice;
      
    if (amount < minBid) {
      setError(`Bid must be at least $${minBid.toFixed(2)}.`);
      return;
    }
    
    setError('');
    onBidSubmit(amount);
    setBidAmount('');
  };

  const suggestedBid = (): number => {
    if (auction.currentBid) {
      return auction.currentBid + Math.ceil(auction.currentBid * 0.05); // Suggest 5% higher
    }
    return auction.startingPrice;
  };
  
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-xl">Place a Bid</CardTitle>
      </CardHeader>
      
      <CardContent>
        {auction.status !== 'active' ? (
          <div className="flex items-center p-4 bg-muted rounded-md">
            <AlertCircle className="h-5 w-5 mr-2 text-muted-foreground" />
            <p className="text-muted-foreground">
              {auction.status === 'ended' 
                ? 'This auction has ended.' 
                : 'This auction is not yet active.'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleBidSubmit}>
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="bidAmount">Your Bid Amount ($)</Label>
                <span className={`text-sm font-medium ${isEnding() ? 'timer-active' : ''}`}>
                  {timeLeft}
                </span>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  id="bidAmount"
                  type="number"
                  step="0.01"
                  min={auction.currentBid ? (auction.currentBid + 1).toString() : auction.startingPrice.toString()}
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  placeholder={`Min bid: $${auction.currentBid ? (auction.currentBid + 1).toFixed(2) : auction.startingPrice.toFixed(2)}`}
                  className={error ? 'border-red-500' : ''}
                  disabled={isSubmitting || auction.status !== 'active'}
                />
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setBidAmount(suggestedBid().toString())}
                  disabled={isSubmitting || auction.status !== 'active'}
                >
                  Suggest
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting || auction.status !== 'active'}
                  className="bg-auction-purple hover:bg-auction-purple-dark"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Bidding...
                    </>
                  ) : (
                    'Place Bid'
                  )}
                </Button>
              </div>
              
              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>
          </form>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between pt-0 text-sm text-muted-foreground">
        <span>Current Bid: {auction.currentBid 
          ? `$${auction.currentBid.toFixed(2)}` 
          : `$${auction.startingPrice.toFixed(2)} (Starting)`}
        </span>
        <span>Total Bids: {auction.bids.length}</span>
      </CardFooter>
    </Card>
  );
};

export default BidForm;
