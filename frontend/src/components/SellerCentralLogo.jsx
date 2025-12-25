import React from 'react';

const SellerCentralLogo = ({ className = "h-8 w-auto" }) => {
  return (
    <img 
      src="/assets/logos/seller-central-logo.png" 
      alt="Seller Central Logo" 
      className={className}
    />
  );
};

export default SellerCentralLogo;