import React, { useEffect } from "react";
import "./MediaDisplay.css";

const MediaDisplay = ({ media }) => {
  return (
    <div className="media-content">
      {media.endsWith(".mp4") ? (
        <video src={media} autoPlay />
      ) : (
        <img src={media} alt="media" />
      )}
    </div>
  );
};

export default MediaDisplay;
