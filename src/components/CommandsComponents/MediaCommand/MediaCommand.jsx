import React, { useEffect, useState } from "react";
import "./MediaCommand.css";
import videoIcon from "../../../assets/icons/video-icon.png";

const MediaCommand = ({ commandButton, sendMedia }) => {
  const [state, setState] = useState(false);
  const [colorClass, setColorClass] = useState("");

  useEffect(() => {
    console.log("COMMAND TYPE ", commandButton.type);
    if (commandButton.type == "sound") {
      setColorClass("sound-color");
    } else if (commandButton.type == "video") {
      setColorClass("video-color");
    }
  }, []);

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
        <button
          className={"media-command-button btn " + colorClass}
          onClick={playMedia}
        >
          <span className="btn-content">
            <img src={videoIcon} alt="Icone son" className="video-icon" />
            {commandButton.name}
          </span>
        </button>
      </div>
    </div>
  );
};

export default MediaCommand;
