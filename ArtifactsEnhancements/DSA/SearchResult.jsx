/*
this is our search result component
it displays the political bias analysis of a news article
includes a visual protractor and rotating arrow to show bias
*/

import React, { useEffect, useState } from 'react';

// convert bias rating to human-readable text
const getReadableBias = (rating) => {
  switch (rating.toLowerCase()) {
    case 'left':
      return 'a left-leaning source';
    case 'left-center':
      return 'a center-left source';
    case 'center':
      return 'a centrist source';
    case 'right-center':
      return 'a center-right source';
    case 'right':
      return 'a right-leaning source';
    default:
      return 'an unknown source';
  }
};

const SearchResult = ({ result, resultRef }) => {
  // state for animation
  const [isVisible, setIsVisible] = useState(false);

  // trigger fade-in animation when result is loaded
  useEffect(() => {
    if (result) {
      const timer = setTimeout(() => setIsVisible(true), 100);
      return () => clearTimeout(timer);
    }
  }, [result]);

  if (!result) return null;

  // map bias ratings to rotation angles for the arrow
  const biasAngleMap = {
    1: -65,  // far left
    2: -30,  // left-center
    3: 0,    // center
    4: 30,   // right-center
    5: 65    // far right
  };

  const ratingNum = result.rating_num; // fallback to center if missing
  const rotationAngle = biasAngleMap[ratingNum];

  return (
    <div
      ref={resultRef}
      className={`mt-10 text-center transition-all duration-700 ease-out transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      {/* news source information */}
      <div className="mb-4">
        <p className="text-lg text-gray-800">
          <span className="font-semibold">News Source:</span> {result.news_source}
        </p>
        <p className="text-md text-gray-600 italic">
          <span className="font-semibold">Type:</span> {result.type}
        </p>
      </div>
      
      {/* visual bias display */}
      <div className="relative flex justify-center items-center w-full h-48">
        {/* background protractor image */}
        <img
          src="/images/protractor.png"
          alt="Political tilt"
          className="w-80 h-auto"
        />

        {/* rotating bias arrow */}
        <img
          src="/images/redarrow.png"
          alt="Bias arrow"
          className="absolute transform origin-bottom"
          style={{
            height: '175px',
            transform: `rotate(${rotationAngle}deg)`,
            top: '1px',
            left: '50%',
            transform: `rotate(${rotationAngle}deg)`,
            transformOrigin: 'bottom center',
            position: 'absolute',
            translate: '-50%'
          }}
        />
      </div>

      {/* bias summary text */}
      <p className="mt-4 text-xl font-semibold text-gray-700">
        The article you selected comes from <span className="italic">{getReadableBias(result.rating)}</span>.
      </p>
    </div>
  );
};

export default SearchResult;
