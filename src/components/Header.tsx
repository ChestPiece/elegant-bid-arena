
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  Gavel, 
  Package, 
  Plus, 
  User,
  LogOut 
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/sonner';

const Header: React.FC = () => {
  const location = useLocation();
  const { user, signOut } = useAuth();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success('Signed out successfully');
  };
  
  return (
    <header className="border-b border-border sticky top-0 z-10 bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center">
        <div className="flex items-center mb-4 sm:mb-0">
          <Gavel className="h-6 w-6 text-auction-purple mr-2" />
          <h1 className="text-2xl font-bold text-foreground">
            AuctionMaster
          </h1>
        </div>
        
        <div className="flex items-center space-x-1">
          <Link to="/">
            <Button 
              variant={isActive('/') ? "secondary" : "ghost"} 
              className="flex items-center"
              size="sm"
            >
              <Home className="h-4 w-4 mr-2" />
              <span>Home</span>
            </Button>
          </Link>
          
          {user ? (
            <>
              <Link to="/my-auctions">
                <Button 
                  variant={isActive('/my-auctions') ? "secondary" : "ghost"}
                  className="flex items-center"
                  size="sm"
                >
                  <Package className="h-4 w-4 mr-2" />
                  <span>My Auctions</span>
                </Button>
              </Link>
              
              <Link to="/my-bids">
                <Button 
                  variant={isActive('/my-bids') ? "secondary" : "ghost"}
                  className="flex items-center"
                  size="sm"
                >
                  <Gavel className="h-4 w-4 mr-2" />
                  <span>My Bids</span>
                </Button>
              </Link>
              
              <Link to="/create">
                <Button 
                  variant="default"
                  className="flex items-center bg-auction-purple hover:bg-auction-purple-dark"
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  <span>New Auction</span>
                </Button>
              </Link>
              
              <Button
                variant="ghost"
                className="flex items-center ml-2"
                size="sm"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4 mr-2" />
                <span>Sign Out</span>
              </Button>
            </>
          ) : (
            <Link to="/auth">
              <Button 
                variant="default"
                className="flex items-center bg-auction-purple hover:bg-auction-purple-dark"
                size="sm"
              >
                <User className="h-4 w-4 mr-2" />
                <span>Sign In</span>
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
