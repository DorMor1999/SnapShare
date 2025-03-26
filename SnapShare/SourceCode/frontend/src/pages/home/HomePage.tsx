// react imports
import React from 'react';

// bootstrap imports
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';

//my imports
import classes from './HomePage.module.css';
import IntervalCarousel from '../../shared/components/UI/IntervalCarousel/IntervalCarousel';

//photos imports
import homePhoto1 from '../../assets/HomePagePhotos/homePhoto1.png';
import homePhoto2 from '../../assets/HomePagePhotos/homePhoto2.jpg';
import homePhoto3 from '../../assets/HomePagePhotos/homePhoto3.jpg';

const HomePage: React.FC = () => {
  const imagesArray: { src: string; alt: string }[] = [
    { src: homePhoto1, alt: 'home photo 1' },
    { src: homePhoto2, alt: 'home photo 2' },
    { src: homePhoto3, alt: 'home photo 3' },
  ];

  return (
    <div className={`${classes['fullscreen-div']} bg-light`}>
      <Container className={classes['container']}>
        <Row>
          <Col md={6} sm={12}>
            <h1>Home Page</h1>
            <p className='fs-5'>
              SnapShare is an intelligent photo management platform designed for
              event organizers to efficiently handle event photos. It features
              advanced facial recognition to automatically sort images and
              allows event owners to share photos privately with relevant
              participants.
            </p>
            <br/>
            <Row>
              {/* need to add buttons */}
              <Col></Col>
              <Col></Col>
            </Row>
            <br/>

          </Col>
          <Col md={6} sm={12}>
            <IntervalCarousel images={imagesArray} interval={3000} />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default HomePage;
