"use client";
import Image from "next/image";
import React, { useState, useCallback } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const Carousel = ({ images }) => {
  const slides = images.map((image, index) => ({
    id: index + 1,
    image,
  }));

  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  }, [slides.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  }, [slides.length]);

  return (
    <div className="w-full relative rounded-lg" aria-live="polite">
      <div className="relative h-96 flex justify-center items-center overflow-hidden rounded-lg">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-transform duration-500 ${
              index === currentIndex
                ? "translate-x-0 opacity-100"
                : index < currentIndex
                ? "-translate-x-full opacity-0"
                : "translate-x-full opacity-0"
            }`}
          >
            <Image
              src={slide.image}
              alt={`Slide ${index + 1}`}
              className="w-full h-full object-cover"
              priority={index === currentIndex}
              
            />
          </div>
        ))}
      </div>

      <button
        className="absolute left-5 top-1/2 group transform -translate-y-1/2 bg-white border border-solid border-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-secondColor hover:text-white transition-all"
        onClick={handlePrev}
        aria-label="Previous Slide"
      >
        <FaArrowLeft className="text-black group-hover:text-white" />
      </button>

      <button
        className="absolute right-5 top-1/2 group transform -translate-y-1/2 bg-white border border-solid border-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-secondColor hover:text-white transition-all"
        onClick={handleNext}
        aria-label="Next Slide"
      >
        <FaArrowRight className="text-black group-hover:text-white" />
      </button>

      <div className="absolute bottom-4 w-full flex justify-center items-center space-x-2">
        {slides.map((_, index) => (
          <div key={index}>
            <button
              className={`w-4 h-4 rounded-full ${
                index === currentIndex ? "bg-black" : "bg-gray-100"
              }`}
              aria-pressed={index === currentIndex}
              role="button"
              tabIndex={0}
              onClick={() => setCurrentIndex(index)}
            ></button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Carousel;
