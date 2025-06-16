import React, { useState } from "react";
import "../styles/HomeSession.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import slide1 from "../../img/slide1.png";
import slide2 from "../../img/slide2.png";
import slide3 from "../../img/slide3.png";

const images = [
  slide1,
  slide2,
  slide3,
];



const HomePage = () => {
  const [current, setCurrent] = useState(0);

  const nextSlide = () => {
    setCurrent(current === images.length - 1 ? 0 : current + 1);
  };

  const prevSlide = () => {
    setCurrent(current === 0 ? images.length - 1 : current - 1);
  };

  const goToSlide = (index) => {
    setCurrent(index);
  };

  const navigate = useNavigate();

  const onClick = () => {
    const el = document.getElementById("service");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (

    <>
      <div className="carousel-container" style={{ cursor: "pointer" }}>
        <button className="arrow left-arrow" onClick={prevSlide}>
          &#10094;
        </button>

        <div
          className="carousel-slide-bg"
          style={{ backgroundImage: `url(${images[current]})` }}
        />

        <div className="carousel-slide" onClick={onClick}>
          <img className="img-slide" src={images[current]} alt={`slide ${current + 1}`} />
        </div>

        <button className="arrow right-arrow" onClick={nextSlide}>
          &#10095;
        </button>

        <div className="carousel-dots">
          {images.map((_, idx) => (
            <span
              key={idx}
              className={`dot ${current === idx ? "active" : ""}`}
              onClick={() => goToSlide(idx)}
            ></span>
          ))}
        </div>
      </div>
    </>
  );
};

export default HomePage;
