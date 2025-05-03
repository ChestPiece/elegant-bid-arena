
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { AuctionFormData } from '@/types/auction';
import { Loader2 } from 'lucide-react';
import { getMinEndDate } from '@/utils/dateUtils';

interface AuctionFormProps {
  onSubmit: (data: AuctionFormData) => Promise<void>;
  isLoading: boolean;
}

const AuctionForm: React.FC<AuctionFormProps> = ({ onSubmit, isLoading }) => {
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = useState<string>('');
  
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<AuctionFormData>({
    defaultValues: {
      title: '',
      description: '',
      startingPrice: 0,
      imageUrl: '',
      endDate: ''
    }
  });
  
  const validateImage = (url: string) => {
    if (!url) return;
    
    const img = new Image();
    img.src = url;
    
    img.onload = () => {
      setImagePreview(url);
      setValue('imageUrl', url);
      toast({
        title: 'Image validated',
        description: 'Image URL is valid and has been previewed.',
      });
    };
    
    img.onerror = () => {
      setImagePreview('');
      toast({
        variant: 'destructive',
        title: 'Invalid image URL',
        description: 'Please enter a valid image URL.',
      });
    };
  };

  const handleFormSubmit = (data: AuctionFormData) => {
    if (!imagePreview) {
      toast({
        variant: 'destructive',
        title: 'Image required',
        description: 'Please validate an image URL before submitting.',
      });
      return;
    }
    
    // Parse numeric input
    const formattedData = {
      ...data,
      startingPrice: parseFloat(data.startingPrice.toString()),
      endDate: data.endDate,
    };
    
    onSubmit(formattedData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          {...register('title', { 
            required: 'Title is required',
            minLength: { value: 5, message: 'Title must be at least 5 characters' },
            maxLength: { value: 100, message: 'Title cannot exceed 100 characters' }
          })}
          placeholder="Auction title"
          className={errors.title ? 'border-red-500' : ''}
        />
        {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          {...register('description', { 
            required: 'Description is required',
            minLength: { value: 20, message: 'Description must be at least 20 characters' }
          })}
          placeholder="Detailed description of the item"
          className={errors.description ? 'border-red-500' : ''}
          rows={5}
        />
        {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="startingPrice">Starting Price ($)</Label>
        <Input
          id="startingPrice"
          type="number"
          step="0.01"
          min="0.01"
          {...register('startingPrice', { 
            required: 'Starting price is required',
            min: { value: 0.01, message: 'Price must be greater than 0' },
            valueAsNumber: true
          })}
          placeholder="0.00"
          className={errors.startingPrice ? 'border-red-500' : ''}
        />
        {errors.startingPrice && <p className="text-sm text-red-500">{errors.startingPrice.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="endDate">End Date & Time</Label>
        <Input
          id="endDate"
          type="datetime-local"
          min={getMinEndDate()}
          {...register('endDate', { 
            required: 'End date is required',
            validate: (value) => 
              new Date(value) > new Date() || 'End date must be in the future'
          })}
          className={errors.endDate ? 'border-red-500' : ''}
        />
        {errors.endDate && <p className="text-sm text-red-500">{errors.endDate.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="imageUrl">Image URL</Label>
        <div className="flex gap-2">
          <Input
            id="imageUrl"
            {...register('imageUrl', { required: 'Image URL is required' })}
            placeholder="https://example.com/image.jpg"
            className={errors.imageUrl ? 'border-red-500' : ''}
          />
          <Button 
            type="button" 
            variant="secondary" 
            onClick={() => validateImage(watch('imageUrl'))}
          >
            Validate
          </Button>
        </div>
        {errors.imageUrl && <p className="text-sm text-red-500">{errors.imageUrl.message}</p>}
      </div>

      {imagePreview && (
        <div className="mt-4 border rounded-md p-2">
          <Label className="block mb-2">Image Preview</Label>
          <img 
            src={imagePreview} 
            alt="Preview" 
            className="h-40 w-full object-contain bg-gray-50 rounded-md"
          />
        </div>
      )}

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating Auction...
          </>
        ) : (
          'Create Auction'
        )}
      </Button>
    </form>
  );
};

export default AuctionForm;
