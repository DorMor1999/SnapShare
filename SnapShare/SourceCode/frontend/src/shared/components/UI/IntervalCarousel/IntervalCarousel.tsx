//react imports
import React from 'react';

//bootsrap imports
import Carousel from 'react-bootstrap/Carousel';

//my imports
import CarouselImage from './CarouselImage';

type IntervalCarouselProps = {
  images: { src: string; alt: string }[]; // Array of images with src and alt attributes
  interval: number;
};

const IntervalCarousel: React.FC<IntervalCarouselProps> = ({ images, interval = 3000}) => {
  return (
    <Carousel interval={interval === -1 ? null : interval}>
      {images.map((currentImage) => (
        <Carousel.Item key={currentImage.alt}>
          <CarouselImage src={currentImage.src} alt={currentImage.alt} />
          <Carousel.Caption></Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default IntervalCarousel;