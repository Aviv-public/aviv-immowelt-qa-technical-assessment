import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

const propertySchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  price: z.string().min(1, 'Price is required'),
  type: z.enum(['sale', 'rent', 'commercial']),
  status: z.enum(['available', 'sold', 'under-contract']),
  bedrooms: z.string().min(1, 'Number of bedrooms is required'),
  bathrooms: z.string().min(1, 'Number of bathrooms is required'),
  area: z.string().min(1, 'Area is required'),
  yearBuilt: z.string().min(1, 'Year built is required'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  zipCode: z.string().min(5, 'ZIP code is required'),
});

type PropertyFormData = z.infer<typeof propertySchema>;

interface AddPropertyFormProps {
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}

export const AddPropertyForm: React.FC<AddPropertyFormProps> = ({ onSubmit, onCancel }) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [imageError, setImageError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      type: 'sale',
      status: 'available',
    },
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    setImageError(null);

    if (selectedImages.length + files.length > 4) {
      setImageError('Maximum 4 images allowed');
      return;
    }

    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) {
        setImageError('Only image files are allowed');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImages(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleFormSubmit = async (data: PropertyFormData) => {
    try {
      setIsSubmitting(true);
      setError(null);

      // Use default images if none are selected
      const images = selectedImages.length > 0 ? selectedImages : [
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1600566753151-384129cf4e3e?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&w=800&q=80',
      ];

      await onSubmit({
        ...data,
        price: parseFloat(data.price),
        images,
        features: {
          bedrooms: parseInt(data.bedrooms),
          bathrooms: parseFloat(data.bathrooms),
          area: parseInt(data.area),
          yearBuilt: parseInt(data.yearBuilt),
        },
        location: {
          address: data.address,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode,
        },
        agent: {
          id: user?.id,
          name: user?.name,
          email: user?.email,
          phone: user?.phone,
        },
      });
    } catch (error) {
      setError('Failed to add property. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {error && (
        <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}

      {/* Image Upload Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Property Images</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {selectedImages.map((image, index) => (
            <div key={index} className="relative aspect-square">
              <img
                src={image}
                alt={`Property ${index + 1}`}
                className="w-full h-full object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-100"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          ))}
          {selectedImages.length < 4 && (
            <label className="border-2 border-dashed border-gray-300 rounded-lg aspect-square flex flex-col items-center justify-center cursor-pointer hover:border-gray-400">
              <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
              <span className="text-sm text-gray-500">Add Image</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                multiple
              />
            </label>
          )}
        </div>
        {imageError && (
          <p className="text-sm text-red-600">{imageError}</p>
        )}
        <p className="text-sm text-gray-500">
          Upload up to 4 images. Recommended size: 800x600px
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Property Title"
          error={errors.title?.message}
          {...register('title')}
        />

        <Select
          label="Property Type"
          error={errors.type?.message}
          options={[
            { value: 'sale', label: 'For Sale' },
            { value: 'rent', label: 'For Rent' },
            { value: 'commercial', label: 'Commercial' },
          ]}
          {...register('type')}
        />

        <Input
          label="Price (€)"
          type="number"
          error={errors.price?.message}
          {...register('price')}
        />

        <Select
          label="Status"
          error={errors.status?.message}
          options={[
            { value: 'available', label: 'Available' },
            { value: 'sold', label: 'Sold' },
            { value: 'under-contract', label: 'Under Contract' },
          ]}
          {...register('status')}
        />

        <Input
          label="Bedrooms"
          type="number"
          error={errors.bedrooms?.message}
          {...register('bedrooms')}
        />

        <Input
          label="Bathrooms"
          type="number"
          step="0.5"
          error={errors.bathrooms?.message}
          {...register('bathrooms')}
        />

        <Input
          label="Area (sqft)"
          type="number"
          error={errors.area?.message}
          {...register('area')}
        />

        <Input
          label="Year Built"
          type="number"
          error={errors.yearBuilt?.message}
          {...register('yearBuilt')}
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Location</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Address"
            error={errors.address?.message}
            {...register('address')}
          />

          <Input
            label="City"
            error={errors.city?.message}
            {...register('city')}
          />

          <Input
            label="State"
            error={errors.state?.message}
            {...register('state')}
          />

          <Input
            label="ZIP Code"
            error={errors.zipCode?.message}
            {...register('zipCode')}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          rows={4}
          {...register('description')}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          Add Property
        </Button>
      </div>
    </form>
  );
};