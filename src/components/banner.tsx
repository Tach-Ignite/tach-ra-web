import React from 'react';
import { Carousel } from 'react-responsive-carousel';

export function Banner() {
  return (
    <div className="relative w-full h-full">
      <div className="absolute bottom-5 w-full h-40 bg-gradient-to-t from-gray-300 to-transparent z-10" />
      <div>
        <Carousel
          autoPlay
          infiniteLoop
          showStatus={false}
          showIndicators={false}
          interval={3000}
        >
          <div>
            <img
              className="object-cover"
              src="/images/carousel/1.jpg"
              width={1920}
              height={1080}
              alt="LaSalle Avenue"
            />
          </div>
          <div>
            <img
              className="object-cover"
              src="/images/carousel/2.jpg"
              width={1920}
              height={1080}
              alt="Chicago Skyline"
            />
          </div>
        </Carousel>
      </div>
    </div>
  );
}
