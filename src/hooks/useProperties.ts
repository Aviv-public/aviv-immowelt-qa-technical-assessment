import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { propertyApi, PropertyFilters } from '../services/api';
import { Property } from '../types';

export const useProperties = (options?: PropertyFilters) => {
  return useQuery({
    queryKey: ['properties', options ?? {}],
    queryFn: () => propertyApi.getProperties(options),
  });
};

export const useAddProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Property>) => propertyApi.createProperty(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });
};

export const useProperty = (id: string) => {
  return useQuery({
    queryKey: ['property', id],
    queryFn: () => propertyApi.getProperty(id),
    enabled: !!id,
  });
};

export const useUpdateProperty = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Property> }) =>
      propertyApi.updateProperty(id, data),
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      queryClient.invalidateQueries({ queryKey: ['property', vars.id] });
    },
  });
};

export const useDeleteProperty = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => propertyApi.deleteProperty(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });
};
