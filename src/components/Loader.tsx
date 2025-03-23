
import React from 'react';

interface LoaderProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
  text?: string;
}

const Loader: React.FC<LoaderProps> = ({ 
  size = 'medium', 
  className = '',
  text
}) => {
  const sizeClasses = {
    small: 'h-4 w-4 border-2',
    medium: 'h-8 w-8 border-3',
    large: 'h-12 w-12 border-4'
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div
        className={`${sizeClasses[size]} rounded-full border-primary/20 border-t-primary animate-spin`}
        role="status"
        aria-label="Loading"
      />
      {text && (
        <p className="mt-3 text-sm text-muted-foreground animate-pulse">{text}</p>
      )}
    </div>
  );
};

export default Loader;
