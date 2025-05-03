
import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface AuctionFiltersProps {
  filter: 'all' | 'active' | 'ended' | 'upcoming';
  onChange: (value: 'all' | 'active' | 'ended' | 'upcoming') => void;
}

const AuctionFilters: React.FC<AuctionFiltersProps> = ({ filter, onChange }) => {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-3">Filter Auctions</h2>
      
      <RadioGroup 
        value={filter} 
        onValueChange={(val) => onChange(val as any)} 
        className="flex flex-wrap gap-2"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="all" id="all" />
          <Label htmlFor="all" className="cursor-pointer">All</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="active" id="active" />
          <Label htmlFor="active" className="cursor-pointer">Active</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="upcoming" id="upcoming" />
          <Label htmlFor="upcoming" className="cursor-pointer">Upcoming</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="ended" id="ended" />
          <Label htmlFor="ended" className="cursor-pointer">Ended</Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default AuctionFilters;
