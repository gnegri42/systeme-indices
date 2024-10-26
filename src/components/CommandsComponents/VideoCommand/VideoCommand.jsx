import React, { useEffect, useState } from "react";
import "./VideoCommand.css";

const VideoCommand = ({ commandButton }) => {
  const [state, setState] = useState(false);

  function playVideo() {}

  return (
    <div className="video-command-container">
      {commandButton.description == "" ? (
        <></>
      ) : (
        <div className="video-command-description">
          {commandButton.description}
        </div>
      )}
      <div className="video-command-content">
        <button className="video-command-button" onClick={playVideo}>
          {commandButton.name}
        </button>
      </div>
    </div>
  );
};

export default VideoCommand;
