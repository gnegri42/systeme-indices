import React, { useState, useEffect } from "react";

function EspStatesComponent({ item, setCounter, counter }) {
  const [etat, setEtat] = useState(false);
  const [loading, setLoading] = useState(true);

  const boutonEtat = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://${item.ip}:3232/setEtatAttente`);
      if (response.ok) {
        setEtat(true);
        setCounter(counter - 1);
      } else {
        setLoading(false);
        setEtat(false);
      }
    } catch (error) {
      setLoading(false);
      setEtat(false);
    }
  };

  useEffect(() => {
    const fetchEtat = async () => {
      try {
        const response = await fetch(`http://${item.ip}:3232/setEtatAttente`);
        if (response.ok) {
          setEtat(true);
          setCounter(counter - 1);
        } else {
          setEtat(false);
        }
      } catch (error) {
        setEtat(false);
      } finally {
        setLoading(false);
      }
    };

    fetchEtat();
  }, []);

  if (etat) {
    return <h3 style={{ color: etat ? "var(--main)" : "red" }}>{item.nom}</h3>;
  }

  return (
    <div className="initItem-container">
      <h3 style={{ color: etat ? "var(--main)" : "red" }}>{item.nom}</h3>
      <span style={{ color: etat ? "var(--main)" : "red" }}>{item.ip}</span>
      {!loading && !etat && (
        <button onClick={boutonEtat} className="btn-reessayer">
          Reessayer
        </button>
      )}
    </div>
  );
}

export default EspStatesComponent;
