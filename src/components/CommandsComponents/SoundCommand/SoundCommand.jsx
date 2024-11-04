import React, { useEffect, useState } from "react";
import "./SoundCommand.css";
import { Howl, Howler } from "howler";

const SoundCommand = ({ commandButton }) => {
  //   const [showControls, setShowControls] = useState(false);
  //   const [state, setState] = useState(false);
  var sound = new Howl({
    src: [commandButton.src],
  });

  return (
    <div className="sound-command-container">
      {commandButton.description == "" ? (
        <></>
      ) : (
        <div className="sound-command-description">
          {commandButton.description}
        </div>
      )}
      <div className="sound-command-content">
        <button
          className="sound-command-button"
          onClick={() => {
            sound.play();
          }}
        >
          {commandButton.name}
        </button>
      </div>
    </div>
  );
};

export default SoundCommand;