import React from 'react';
import { Image } from 'react-bootstrap';

// Define the CarouselImage component
const CarouselImage: React.FC<{ src: string; alt: string }> = ({ src, alt }) => {
  return (
    <Image
      src={src} // Use the src prop for the image path
      alt={alt} // Use the alt prop for accessibility
      fluid // Makes the image responsive
    />
  );
};

export default CarouselImage;
