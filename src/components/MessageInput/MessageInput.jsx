import React, { useEffect, useState } from "react";
import { Howl, Howler } from "howler";
import "./MessageInput.css";
import jingleIndice from "../../assets/jingle_indice.mp3";

const MessageInput = ({
  onSend,
  autofocus = false,
  textarea = false,
  sendButton = true,
  playJingle = false,
}) => {
  const [text, setText] = useState("");
  // Si on joue le jingle, on crée une instance de Howler, sinon on ne fait rien
  var indiceSound = playJingle
    ? new Howl({
        src: [jingleIndice],
      })
    : null;

  /**
   * A la validation de l'input, renvoit le texte à la page initiale et vide l'input
   * @param {*} e
   */
  const handleSend = (e) => {
    e.preventDefault();
    onSend(text);
    setText("");
    if (playJingle && indiceSound != null) {
      indiceSound.play();
    }
  };

  return (
    <>
      <form onSubmit={handleSend} className="player-form">
        {textarea ? (
          <textarea value={text} onChange={(e) => setText(e.target.value)} />
        ) : (
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            autoFocus={autofocus}
          />
        )}
        {sendButton ? <button type="submit">Envoyer</button> : <></>}
      </form>
    </>
  );
};

export default MessageInput;
