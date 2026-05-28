import { useParams } from 'react-router-dom';
import { PropertyGallery } from '../components/property/PropertyGallery';
import { PropertyFeatures } from '../components/property/PropertyFeatures';
import { PropertyContact } from '../components/property/PropertyContact';
import { SimilarProperties } from '../components/property/SimilarProperties';
import { useProperties, useProperty } from '../hooks/useProperties';
import { formatCurrency } from '../utils/format';

export const PropertyDetails = () => {
  const { id } = useParams();

  const { data: property, isLoading } = useProperty(id ?? '');
  const { data: allProperties = [] } = useProperties();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading…</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Property not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.title}</h1>
        <p className="text-gray-500">{property.location.address}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <PropertyGallery images={property.images} title={property.title} />

          <div className="mt-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">{formatCurrency(property.price)}</h2>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {property.type.toUpperCase()}
                </span>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  {property.status.toUpperCase()}
                </span>
              </div>
            </div>

            <PropertyFeatures features={property.features} />

            <div className="mt-8">
              <h2 className="text-xl font-bold mb-4">Description</h2>
              <p className="text-gray-600 whitespace-pre-line">{property.description}</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <PropertyContact
            agent={property.agent}
            propertyTitle={property.title}
          />
        </div>
      </div>

      <SimilarProperties currentProperty={property} properties={allProperties} />
    </div>
  );
};
