import React, { useEffect, useState } from "react";
import "./BypassCommand.css";

const Bypass = ({ commandButton }) => {
  const [connected, setConnected] = useState(false);
  const [state, setState] = useState(false);

  useEffect(() => {
    pingIp();

    // const pingInterval = setInterval(pingIP, 10000);
    // return () => clearInterval(pingInterval);
  }, [commandButton.ip]);

  async function pingIp() {
    try {
      const response = await fetch(`http://${commandButton.ip}:3232/ping`);
      if (response.ok) {
        setConnected(true);
      } else {
        setConnected(false);
      }
    } catch (error) {
      setConnected(false);
      console.log("ERREUR LORS DE LA CONNEXION AVEC ", commandButton.ip);
      console.log(error);
    }
  }

  async function activateBypass() {
    try {
      const response = await fetch(
        `http://${commandButton.ip}:3232/setStateActif`
      );
      if (response.ok) {
        setState(true);
      } else {
        setState(false);
      }
    } catch (error) {
      setState(false);
    }
  }

  return (
    <div className="bypass-container">
      {commandButton.description == "" ? (
        <></>
      ) : (
        <div className="bypass-description">{commandButton.description}</div>
      )}
      <div className="bypass-content">
        <button className="bypass-button btn" onClick={activateBypass}>
          {commandButton.name}
        </button>
        <button className="ping-button" onClick={pingIp}>
          Relancer la connexion
        </button>
      </div>
      <p>{connected ? "Connecté" : "Déconnecté"}</p>
    </div>
  );
};

export default Bypass;
