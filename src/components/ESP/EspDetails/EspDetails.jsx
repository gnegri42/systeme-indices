import React, { useState, useEffect } from "react";

function EspDetailsComponent({ nom, description, activer_endpoint, ip }) {
  const [connecte, setConnecte] = useState(false);
  const [etat, setEtat] = useState(false);

  useEffect(() => {
    const pingIP = async () => {
      try {
        const response = await fetch(`http://${ip}:3232/ping`);
        if (response.ok) {
          setConnecte(true);
        } else {
          setConnecte(false);
        }
      } catch (error) {
        setConnecte(false);
      }
    };
    const pingInterval = setInterval(pingIP, 10000);
    return () => clearInterval(pingInterval);
  }, [ip]);

  useEffect(() => {
    const etat = async () => {
      try {
        const response = await fetch(`http://${ip}:3232/etat`);
        if (response.ok) {
          setEtat(true);
        } else {
          setEtat(false);
        }
      } catch (error) {
        setEtat(false);
      }
    };

    const etatInterval = setInterval(etat, 12000);
    return () => clearInterval(etatInterval);
  }, [etat]);

  //bouton envoyer
  const handleSubmit = async () => {
    try {
      const response = await fetch(`http://${ip}:3232/setEtatActif`);
      if (response.ok) {
        setEtat(true);
      } else {
        setEtat(false);
      }
    } catch (error) {
      setEtat(false);
    }
  };

  return (
    <div className="item-container">
      <span className="item-header">
        <h2>{nom}</h2>
        <p>{description}</p>
      </span>

      <span className="item-body">
        <p>IP: {ip}</p>

        <p>
          Statut:{" "}
          <span style={{ color: connecte ? "var(--main)" : "red" }}>
            {connecte ? "Connecte" : "Deconnecte"}
          </span>
        </p>
        <p>Etat: {etat ? "actif" : "en attente"}</p>
      </span>
      {!etat && (
        <button className="item-button" onClick={handleSubmit}>
          Actionner
        </button>
      )}
    </div>
  );
}

export default EspDetailsComponent;
