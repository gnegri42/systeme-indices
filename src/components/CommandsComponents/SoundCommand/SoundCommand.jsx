import React, { useEffect, useState } from "react";
import "./SoundCommand.css";
import H5AudioPlayer from "react-h5-audio-player";

const SoundCommand = ({ commandButton }) => {
  const [showControls, setShowControls] = useState(false);
  const [state, setState] = useState(false);

  useEffect(() => {
    console.log("COMMANDES BUTTN : ", commandButton);
    console.log("COMMANDES BUTTN LOOP : ", commandButton.loop);
  }, []);

  return (
    <div className="sound-command-container">
      {showControls ? (
        <H5AudioPlayer
          hasDefaultKeyBinding={false}
          loop={commandButton.loop}
          src={commandButton.src}
        />
      ) : (
        <></>
      )}

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
            setShowControls(!showControls);
          }}
        >
          {showControls ? "Fermer le lecteur" : commandButton.name}
        </button>
      </div>
    </div>
  );
};

export default SoundCommand;
