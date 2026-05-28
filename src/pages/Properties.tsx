import { PropertySearch } from '../components/search/PropertySearch';
import { PropertyGrid } from '../components/property/PropertyGrid';
import { useProperties } from '../hooks/useProperties';
import { useSearch } from '../hooks/useSearch';

export const Properties = () => {
  const { filters, searchTerm } = useSearch();
  const { data: properties = [], isLoading } = useProperties({
    type: filters.type,
    status: filters.status,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    bedrooms: filters.bedrooms,
    bathrooms: filters.bathrooms,
    location: filters.location,
    q: searchTerm || undefined,
    sort:
      filters.sortBy === 'price-asc'
        ? 'price_asc'
        : filters.sortBy === 'price-desc'
        ? 'price_desc'
        : filters.sortBy === 'date-asc'
        ? 'oldest'
        : filters.sortBy === 'date-desc'
        ? 'newest'
        : undefined,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">All Properties</h1>

      <PropertySearch />

      <div className="mt-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Available Properties</h2>
          <span className="text-gray-600">
            {isLoading ? 'Loading…' : `${properties.length} properties found`}
          </span>
        </div>
        <PropertyGrid properties={properties} />
      </div>
    </div>
  );
};
