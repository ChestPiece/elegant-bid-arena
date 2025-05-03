
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAuctionById, placeBid } from '@/services/auctionService';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDate, formatTimeLeft } from '@/utils/dateUtils';
import { Loader2, ArrowLeft } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import BidForm from '@/components/BidForm';
import BidHistory from '@/components/BidHistory';

const AuctionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [timeLeft, setTimeLeft] = useState<string>('');
  
  const { data: auction, isLoading, error } = useQuery({
    queryKey: ['auction', id],
    queryFn: () => getAuctionById(id || ''),
    enabled: !!id,
  });
  
  const bidMutation = useMutation({
    mutationFn: (amount: number) => placeBid(id || '', amount),
    onSuccess: (result) => {
      if (result.success) {
        toast({
          title: 'Bid Placed Successfully!',
          description: result.message,
        });
        
        // Update auction data in cache
        queryClient.invalidateQueries({ queryKey: ['auction', id] });
        queryClient.invalidateQueries({ queryKey: ['auctions'] });
        queryClient.invalidateQueries({ queryKey: ['my-bids'] });
      } else {
        toast({
          variant: 'destructive',
          title: 'Bid Failed',
          description: result.message,
        });
      }
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An unexpected error occurred while placing your bid.',
      });
    },
  });
  
  React.useEffect(() => {
    if (auction && auction.status === 'active') {
      const timer = setInterval(() => {
        const timeLeftStr = formatTimeLeft(auction.endDate);
        setTimeLeft(timeLeftStr);
        
        if (timeLeftStr === 'Auction ended') {
          // Reload auction data if it just ended
          queryClient.invalidateQueries({ queryKey: ['auction', id] });
          clearInterval(timer);
        }
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [auction, id, queryClient]);
  
  const handleBidSubmit = (amount: number) => {
    bidMutation.mutate(amount);
  };
  
  const getBadgeColor = () => {
    if (!auction) return '';
    
    if (auction.status === 'active') {
      return 'bg-green-100 text-green-800 hover:bg-green-100';
    } else if (auction.status === 'ended') {
      return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
    return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-auction-purple" />
      </div>
    );
  }
  
  if (error || !auction) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button variant="outline" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Auction Not Found</h2>
            <p className="text-muted-foreground mb-6">
              The auction you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate('/')}>Browse Auctions</Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="outline" onClick={() => navigate(-1)} className="mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" /> Back
      </Button>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
            <div className="relative h-[300px] sm:h-[400px]">
              <img 
                src={auction.imageUrl} 
                alt={auction.title}
                className="w-full h-full object-contain p-4"
              />
              <Badge 
                className={`absolute top-4 right-4 ${getBadgeColor()}`}
              >
                {auction.status.charAt(0).toUpperCase() + auction.status.slice(1)}
              </Badge>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h1 className="text-2xl font-bold mb-2">{auction.title}</h1>
            
            <div className="flex flex-wrap gap-x-8 gap-y-2 mb-4 text-sm">
              <div className="flex items-center">
                <span className="text-muted-foreground mr-2">Starting Price:</span>
                <span className="font-medium">${auction.startingPrice.toFixed(2)}</span>
              </div>
              
              <div className="flex items-center">
                <span className="text-muted-foreground mr-2">Current Bid:</span>
                <span className="font-medium">
                  {auction.currentBid 
                    ? `$${auction.currentBid.toFixed(2)}` 
                    : 'No bids yet'}
                </span>
              </div>
              
              <div className="flex items-center">
                <span className="text-muted-foreground mr-2">End Date:</span>
                <span className="font-medium">{formatDate(auction.endDate)}</span>
              </div>
              
              {auction.status === 'active' && (
                <div className="flex items-center">
                  <span className="text-muted-foreground mr-2">Time Left:</span>
                  <span className="font-medium">{timeLeft || formatTimeLeft(auction.endDate)}</span>
                </div>
              )}
            </div>
            
            <div className="prose max-w-none">
              <h3 className="text-lg font-medium mb-2">Description</h3>
              <p className="text-gray-700 whitespace-pre-line">{auction.description}</p>
            </div>
          </div>
          
          <BidForm 
            auction={auction}
            onBidSubmit={handleBidSubmit}
            isSubmitting={bidMutation.isPending}
          />
        </div>
        
        <div className="lg:col-span-1">
          <BidHistory auction={auction} />
        </div>
      </div>
    </div>
  );
};

export default AuctionDetailPage;
