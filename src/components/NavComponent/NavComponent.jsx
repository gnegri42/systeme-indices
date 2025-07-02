import React from "react";
import "./NavComponent.css";

function Nav({ setStepToShow, Commands }) {
  return (
    <div className="nav-container">
      <ul className="nav">
        {Commands.map((commands, index) => (
          <li className="nav-item">
            <a
              onClick={() => {
                {
                  setStepToShow(commands.step);
                }
              }}
            >
              {commands.step_name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Nav;
