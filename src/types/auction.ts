
export interface Auction {
  id: string;
  title: string;
  description: string;
  startingPrice: number;
  currentBid: number | null;
  highestBidder: string | null;
  imageUrl: string;
  endDate: Date;
  status: 'active' | 'ended' | 'upcoming';
  bids: Bid[];
  createdBy: string;
}

export interface Bid {
  id: string;
  auctionId: string;
  bidder: string;
  amount: number;
  timestamp: Date;
}

export interface AuctionFormData {
  title: string;
  description: string;
  startingPrice: number;
  imageUrl: string;
  endDate: string;
}
