import { Carousel as BootstrapCarousel } from 'react-bootstrap';

interface CarouselProps {
  imagesArray: string[];
}

function CustomCarosul({ imagesArray }: CarouselProps) {
  if (!imagesArray || imagesArray.length === 0) {
    return <div>No images to display</div>;
  }

  return (
    <BootstrapCarousel>
      {imagesArray.map((image, index) => (
        <BootstrapCarousel.Item key={index}>
          <img
            className="d-block w-100 h-50"
            src={image}
            alt={`Slide ${index + 1}`}
          />
        </BootstrapCarousel.Item>
      ))}
    </BootstrapCarousel>
  );
}

export default CustomCarosul;
