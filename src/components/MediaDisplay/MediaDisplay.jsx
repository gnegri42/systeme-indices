import React, { useEffect } from "react";
import "./MediaDisplay.css";

const MediaDisplay = ({ media }) => {
  useEffect(() => {
    console.log("MEDIA : ", media);
  }, [media]);

  return (
    <div className="media-content">
      {media.endsWith(".mp4") ? (
        <video autoPlay loop id="media-video">
          <source src={media} type="video/mp4" />
        </video>
      ) : (
        <img src={media} alt="media" />
      )}
    </div>
  );
};

export default MediaDisplay;
