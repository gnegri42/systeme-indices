import React, { useEffect, useState } from "react";
import "./MessageInput.css";

const MessageInput = ({ onSend, autofocus = false }) => {
  const [text, setText] = useState("");

  /**
   * A la validation de l'input, renvoit le texte à la page initiale et vide l'input
   * @param {*} e
   */
  const handleSend = (e) => {
    e.preventDefault();
    onSend(text);
    setText("");
  };

  return (
    <>
      <form onSubmit={handleSend} className="player-form">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          autoFocus={autofocus}
        />
        <button type="submit">Envoyer</button>
      </form>
    </>
  );
};

export default MessageInput;
