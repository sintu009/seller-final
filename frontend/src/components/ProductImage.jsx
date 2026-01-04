import { Package } from "lucide-react";
import { useGetImageSasUrlQuery } from "../store/slices/apiSlice";

const ProductImage = ({ blobName, alt, className = "w-12 h-12 rounded-md object-cover mr-3" }) => {
  const { data, isLoading, isError } = useGetImageSasUrlQuery(blobName, {
    skip: !blobName,
  });

  if (isLoading || isError || !data?.sasUrl) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
        <Package className="w-6 h-6 text-gray-400" />
      </div>
    );
  }

  return (
    <img
      src={data.sasUrl}
      alt={alt}
      className={className}
    />
  );
};

export default ProductImage;
