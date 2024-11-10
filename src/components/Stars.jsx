import React from 'react';
import { useState } from 'react';

const containerstyle = {
    display: 'flex',
    alignItems: 'center',
    height: '50px',
    width: '100%',
    gap: "10px",
};

const starsbox = {
    display: 'flex',
    gap: "2px",
    fontSize: '15px',
    justifyContent: 'center',

};

const ratingStyle = {
    fontSize: '18px',
    fontWeight: 'bold',
    color:'yel'
};

const Stars = ({ numstars = 10,userRating,setUserRating }) => {
    // const [rating, setRating] = useState(0);
    const [temp, settemp] = useState(0);

    return (
        <div style={containerstyle}>
            <div style={starsbox}>
                {Array.from({ length: numstars }, (_, i) => (
                    <Star
                        key={i}
                        rating={userRating}
                        temp={temp}
                        onRate={() => setUserRating(i + 1)}
                        current={i + 1}
                        onhoverIn={() => settemp(i + 1)}
                        onhoverout={() => settemp(0)}
                        hover={temp ? temp >= i + 1 : userRating >= i + 1}
                    />
                ))}
            </div>
            <div style={ratingStyle}>{temp ? temp : userRating || ''}</div>
        </div>
    );
};
const AbcContainer = {
    height: '5vh',
    display: 'flex',
    cursor: 'pointer',
};
function Star({ hover, rating, temp, onRate, current, onhoverIn, onhoverout }) {

    return (
        <span
            style={AbcContainer}
            onClick={onRate}
            onMouseEnter={onhoverIn}
            onMouseLeave={onhoverout}

        >
            {hover ? (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="#FFD700"
                    viewBox="0 0 24 24"
                    stroke="#000"
                    width="24"
                    height="24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                </svg>
            ) : (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="#"
                    width="24"
                    height="24"
                >
                    <path
                        d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                    />
                </svg>
            )}
        </span>
    );
}

export default Stars;
