import React, {useState} from 'react';
import './reviewCarousel.css'; // Import CSS for styling
import NextIcon from '~/assets/next.png';
import PrevIcon from '~/assets/back.png';

const ReviewsCarousel = ({reviews}) => {
  if (!reviews) return null;
  const [currentIndex, setCurrentIndex] = useState(0);
  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === reviews.length - 1 ? 0 : prevIndex + 1,
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? reviews.length - 1 : prevIndex - 1,
    );
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <span key={index} className={`star ${index < rating ? 'filled' : ''}`}>
        &#9733;
      </span>
    ));
  };

  return (
    <div className="reviews-carousel">
      {reviews.map((review, index) => (
        <div
          key={review.id}
          className={`review-card ${
            index === currentIndex ? 'active-slide' : ''
          }`}
        >
          <div className="review-rating">{renderStars(review.rating)}</div>
          <h3>{review.title}</h3>
          <p>{review.body}</p>
          <p>Reviewer: {review.reviewer.name}</p>
        </div>
      ))}

      <img
        onClick={prevSlide}
        src={PrevIcon}
        height={25}
        width={25}
        className="carousel-btn prev-btn"
      />
      <img
        onClick={nextSlide}
        src={NextIcon}
        height={25}
        width={25}
        className="carousel-btn next-btn"
      />
    </div>
  );
};

export default ReviewsCarousel;
