
import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createAuction } from '@/services/auctionService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { AuctionFormData } from '@/types/auction';
import AuctionForm from '@/components/AuctionForm';

const CreateAuctionPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const createAuctionMutation = useMutation({
    mutationFn: async (formData: AuctionFormData) => {
      return await createAuction({
        ...formData,
        endDate: new Date(formData.endDate)
      });
    },
    onSuccess: (data) => {
      toast({
        title: 'Auction Created',
        description: 'Your auction has been created successfully.',
      });
      
      queryClient.invalidateQueries({ queryKey: ['auctions'] });
      queryClient.invalidateQueries({ queryKey: ['my-auctions'] });
      
      navigate(`/auctions/${data.id}`);
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An error occurred while creating your auction.',
      });
    },
  });
  
  const handleFormSubmit = async (data: AuctionFormData) => {
    await createAuctionMutation.mutate(data);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="outline" onClick={() => navigate(-1)} className="mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" /> Back
      </Button>
      
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Create New Auction</CardTitle>
        </CardHeader>
        <CardContent>
          <AuctionForm 
            onSubmit={handleFormSubmit} 
            isLoading={createAuctionMutation.isPending} 
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateAuctionPage;
