import React, { useEffect, useState } from "react";
import "./MediaCommand.css";

const MediaCommand = ({ commandButton, sendMedia }) => {
  const [state, setState] = useState(false);

  function playMedia() {
    sendMedia(commandButton.src);
  }

  return (
    <div className="media-command-container">
      {commandButton.description == "" ? (
        <></>
      ) : (
        <div className="media-command-description">
          {commandButton.description}
        </div>
      )}
      <div className="media-command-content">
        <button className="media-command-button" onClick={playMedia}>
          {commandButton.name}
        </button>
      </div>
    </div>
  );
};

export default MediaCommand;
