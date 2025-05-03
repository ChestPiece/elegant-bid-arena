
import { Auction, Bid } from '@/types/auction';

// Sample images for auctions
const sampleImages = [
  'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fGxhcHRvcHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
  'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dGVjaHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTR8fGZ1cm5pdHVyZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
  'https://images.unsplash.com/photo-1721322800607-8c38375eef04?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fGFydHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
];

// Sample data for initial auctions
const sampleAuctionData: Auction[] = [
  {
    id: '1',
    title: 'Vintage Laptop',
    description: 'A beautiful vintage laptop in excellent condition. Perfect for collectors or nostalgic tech enthusiasts.',
    startingPrice: 100,
    currentBid: 125,
    highestBidder: 'user2@example.com',
    imageUrl: sampleImages[0],
    endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    status: 'active',
    bids: [
      {
        id: 'bid1',
        auctionId: '1',
        bidder: 'user2@example.com',
        amount: 125,
        timestamp: new Date(Date.now() - 1000 * 60 * 60),
      },
      {
        id: 'bid2',
        auctionId: '1',
        bidder: 'user3@example.com',
        amount: 115,
        timestamp: new Date(Date.now() - 2000 * 60 * 60),
      },
    ],
    createdBy: 'user1@example.com',
  },
  {
    id: '2',
    title: 'Gaming Desktop',
    description: 'High-performance gaming desktop with RTX 3080, 32GB RAM, and 1TB SSD.',
    startingPrice: 1200,
    currentBid: 1250,
    highestBidder: 'user1@example.com',
    imageUrl: sampleImages[1],
    endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    status: 'active',
    bids: [
      {
        id: 'bid3',
        auctionId: '2',
        bidder: 'user1@example.com',
        amount: 1250,
        timestamp: new Date(Date.now() - 500 * 60 * 60),
      },
    ],
    createdBy: 'user3@example.com',
  },
  {
    id: '3',
    title: 'Modern Coffee Table',
    description: 'Sleek and stylish coffee table with glass top and wooden legs.',
    startingPrice: 200,
    currentBid: 230,
    highestBidder: 'user4@example.com',
    imageUrl: sampleImages[2],
    endDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
    status: 'active',
    bids: [
      {
        id: 'bid4',
        auctionId: '3',
        bidder: 'user4@example.com',
        amount: 230,
        timestamp: new Date(Date.now() - 300 * 60 * 60),
      },
      {
        id: 'bid5',
        auctionId: '3',
        bidder: 'user1@example.com',
        amount: 220,
        timestamp: new Date(Date.now() - 400 * 60 * 60),
      },
      {
        id: 'bid6',
        auctionId: '3',
        bidder: 'user2@example.com',
        amount: 210,
        timestamp: new Date(Date.now() - 500 * 60 * 60),
      },
    ],
    createdBy: 'user3@example.com',
  },
  {
    id: '4',
    title: 'Abstract Wall Art',
    description: 'Beautiful abstract art piece, perfect for modern interior decoration.',
    startingPrice: 150,
    currentBid: null,
    highestBidder: null,
    imageUrl: sampleImages[3],
    endDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 days from now
    status: 'upcoming',
    bids: [],
    createdBy: 'user2@example.com',
  },
];

// In-memory storage
let auctionsData: Auction[] = [...sampleAuctionData];
const currentUser = 'current@user.com'; // Simulating a logged-in user

// Auction service functions
export const getAuctions = async (): Promise<Auction[]> => {
  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Update auction statuses based on end dates
  auctionsData = auctionsData.map(auction => {
    if (auction.endDate < new Date() && auction.status !== 'ended') {
      return { ...auction, status: 'ended' };
    }
    return auction;
  });
  
  return auctionsData;
};

export const getAuctionById = async (id: string): Promise<Auction | undefined> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const auction = auctionsData.find(a => a.id === id);
  
  // Update auction status if needed
  if (auction && auction.endDate < new Date() && auction.status !== 'ended') {
    auction.status = 'ended';
  }
  
  return auction;
};

export const createAuction = async (auctionData: Omit<Auction, 'id' | 'status' | 'currentBid' | 'highestBidder' | 'bids' | 'createdBy'>): Promise<Auction> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const newAuction: Auction = {
    ...auctionData,
    id: `auction-${Date.now()}`,
    status: new Date() < auctionData.endDate ? 'active' : 'ended',
    currentBid: null,
    highestBidder: null,
    bids: [],
    createdBy: currentUser,
  };
  
  auctionsData.push(newAuction);
  return newAuction;
};

export const placeBid = async (auctionId: string, amount: number): Promise<{ success: boolean; message: string; auction?: Auction }> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const auction = auctionsData.find(a => a.id === auctionId);
  
  if (!auction) {
    return { success: false, message: 'Auction not found.' };
  }
  
  if (auction.status !== 'active') {
    return { success: false, message: 'This auction is not active.' };
  }
  
  if (auction.endDate < new Date()) {
    auction.status = 'ended';
    return { success: false, message: 'This auction has ended.' };
  }
  
  if (auction.currentBid && amount <= auction.currentBid) {
    return { success: false, message: `Bid must be higher than the current bid of $${auction.currentBid}.` };
  }
  
  if (!auction.currentBid && amount < auction.startingPrice) {
    return { success: false, message: `Bid must be at least the starting price of $${auction.startingPrice}.` };
  }
  
  if (auction.createdBy === currentUser) {
    return { success: false, message: 'You cannot bid on your own auction.' };
  }
  
  // Create new bid
  const newBid: Bid = {
    id: `bid-${Date.now()}`,
    auctionId: auction.id,
    bidder: currentUser,
    amount: amount,
    timestamp: new Date(),
  };
  
  // Update auction with new bid
  auction.bids.push(newBid);
  auction.currentBid = amount;
  auction.highestBidder = currentUser;
  
  return { success: true, message: 'Bid placed successfully!', auction };
};

export const getMyAuctions = async (): Promise<Auction[]> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // Update statuses first
  auctionsData = auctionsData.map(auction => {
    if (auction.endDate < new Date() && auction.status !== 'ended') {
      return { ...auction, status: 'ended' };
    }
    return auction;
  });
  
  return auctionsData.filter(auction => auction.createdBy === currentUser);
};

export const getMyBids = async (): Promise<Auction[]> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // Update statuses first
  auctionsData = auctionsData.map(auction => {
    if (auction.endDate < new Date() && auction.status !== 'ended') {
      return { ...auction, status: 'ended' };
    }
    return auction;
  });
  
  return auctionsData.filter(auction => 
    auction.bids.some(bid => bid.bidder === currentUser)
  );
};

export const filterAuctionsByStatus = (auctions: Auction[], status: 'active' | 'ended' | 'upcoming' | 'all'): Auction[] => {
  if (status === 'all') {
    return auctions;
  }
  
  return auctions.filter(auction => auction.status === status);
};
