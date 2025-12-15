import React from 'react';
import { TailSpin } from 'react-loader-spinner';

const LoadingSpinner = ({ size = 40, color = '#2E7D32' }) => {
  return (
    <div className="flex justify-center items-center p-4">
      <TailSpin
        height={size}
        width={size}
        color={color}
        ariaLabel="loading"
      />
    </div>
  );
};

export default LoadingSpinner;