import { useState } from "react";
import EspStatesComponent from "../EspStates/EspStates";
import EspList from "../../../esps-list.json";
import { useEffect } from "react";

function EspPanelComponent() {
  const [submit, setSubmit] = useState(false);
  const [counter, setCounter] = useState(EspList.length);
  const [submitCounter, setSubmitCounter] = useState(0);

  const handleSubmit = () => {
    setSubmitCounter(submitCounter + 1);
    if (submitCounter % 2) {
      setSubmit(true);
    } else {
      setSubmit(false);
    }
  };

  useEffect(() => {
    console.log(counter);
    if (counter === EspList.length) {
      setSubmit(false);
    }
  }, [counter]);

  useEffect(() => {
    console.log("ESPS : ", EspList);
  }, []);

  return (
    <div className="container-panel">
      <button onClick={handleSubmit} className="bouton-panel">
        Initialiser
      </button>

      {submit &&
        EspList.map((esps, index) =>
          esps.items.map((item, index) => (
            <div key={index} className="init-parent-container">
              <EspStatesComponent
                item={item}
                setCounter={setCounter}
                counter={counter}
              />
            </div>
          ))
        )}
    </div>
  );
}

export default EspPanelComponent;
