import { Package } from "lucide-react";
import { useGetImageSasUrlQuery } from "../store/slices/apiSlice";

const ProductImage = ({ blobName, alt }) => {
  const { data, isLoading, isError } = useGetImageSasUrlQuery(blobName, {
    skip: !blobName
  });

  if (isLoading || isError || !data?.sasUrl) {
    return (
      <div className="w-12 h-12 rounded-md bg-gray-200 flex items-center justify-center mr-3">
        <Package className="w-6 h-6 text-gray-400" />
      </div>
    );
  }

  return (
    <img
      src={data.sasUrl}
      alt={alt}
      className="w-12 h-12 rounded-md object-cover mr-3"
    />
  );
};

export default ProductImage;
