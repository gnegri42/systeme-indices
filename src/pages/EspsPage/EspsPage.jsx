import React, { useState, useEffect } from "react";
import EspPanelComponent from "../../components/ESP/EspPanel/EspPanel";
import EspList from "../../esps-list.json";
import EspDetailsComponent from "../../components/ESP/EspDetails/EspDetails";

const EspsPage = () => {
  const [stepToShow, setStepToShow] = useState("2");

  return (
    <div className="esps-container">
      {EspList.map((esps, index) =>
        esps.step == stepToShow ? (
          esps.items.map((esp, index) => (
            <div key={index}>
              <EspDetailsComponent
                nom={esp.nom}
                description={esp.description}
                etat_endpoint={esp.etat_endpoint}
                activer_endpoint={esp.activer_endpoint}
                ip={esp.ip}
              />
            </div>
          ))
        ) : (
          <></>
          //   <EspPanelComponent />
        )
      )}
    </div>
  );
};

export default EspsPage;
