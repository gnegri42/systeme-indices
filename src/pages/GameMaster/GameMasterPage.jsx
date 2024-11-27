import React, { useState, useEffect } from "react";
import "./GameMasterPage.css";
import { mainUrl } from "../../config/config";
import Commands from "../../assets/commands.json";

// Components
import MessageInput from "../../components/MessageInput/MessageInput";
import ChatWindow from "../../components/ChatWindow/ChatWindow";
import Bypass from "../../components/CommandsComponents/BypassCommand/BypassCommand";
import MediaCommand from "../../components/CommandsComponents/MediaCommand/MediaCommand";
import SoundCommand from "../../components/CommandsComponents/SoundCommand/SoundCommand";
import ChronometerComponent from "../../components/ChronometerComponent/ChronometerComponent";
import Nav from "../../components/NavComponent/NavComponent";
import videoIcon from "../../assets/icons/video-icon.png";

const GameMasterPage = () => {
  const [messages, setMessages] = useState([]);
  const [ws, setWs] = useState(null);
  const WS_URL = `ws://${mainUrl}:8080`;
  const [stepToShow, setStepToShow] = useState("1");

  useEffect(() => {
    if (messages.length > 4) {
      setMessages((prevMessages) => [...prevMessages.slice(1)]);
    }
    // On ramène le scroll tout en bas
    const messageBody = document.querySelector("#messages-list");
    messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight;
  }, [messages]);

  /**
   * Gestion de la réception des messages avec Websocket
   */
  useEffect(() => {
    const socket = new WebSocket(WS_URL);
    setWs(socket);

    socket.onmessage = async (event) => {
      let data = event.data;
      // Check if the data is a Blob
      if (data instanceof Blob) {
        data = await data.text();
      }
      try {
        const messageData = JSON.parse(data);
        console.log("Received message:", messageData);
        setMessages((prevMessages) => [...prevMessages, messageData]);
      } catch (error) {
        console.error("Error parsing message as JSON:", error);
      }
    };
    socket.onopen = () => {
      console.log("WebSocket connected!");
    };
    socket.onclose = () => {
      console.log("WebSocket disconnected!");
    };
    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
    return () => {
      socket.close();
    };
  }, []);

  /**
   * Ajout un texte à la liste des messages de la page.
   * Si le nombre des messages stockés est supérieur à 4, enlève le premier
   * @param {string} message Texte à ajouter
   */
  function addToMessages(message) {
    setMessages((prevMessages) => [...prevMessages, message]);
  }

  /**
   * Envoie le message au server avec Websocket et l'ajoute dans la liste pour l'afficher
   * @param {string} text
   */
  function sendMessage(text) {
    const messageToSend = { type: "chat", target: "player", content: text };
    ws.send(JSON.stringify(messageToSend));
    addToMessages(messageToSend);
  }

  /**
   * Envoie un nouveau média au server
   * @param {string} media URL du média
   */
  function sendMedia(media) {
    ws.send(
      JSON.stringify({ type: "media", target: "player", content: media })
    );
  }

  /**
   * Supprime les messages de la liste des messages.
   * Envoie l'information au serveur pour les supprimer ailleurs si besoin
   */
  function resetChat() {
    ws.send(JSON.stringify({ type: "reset-chat", target: "player" }));
    setMessages([]);
  }

  return (
    <div id="gamemaster-page">
      <div className="gamemaster-clues">
        <ChronometerComponent />
        <ChatWindow messages={messages} />
        <MessageInput
          onSend={sendMessage}
          textarea={false}
          sendButton={false}
        />
        <button onClick={() => resetChat()}>Reset Chat</button>
      </div>
      <div className="gamemaster-game-track">
        <Nav setStepToShow={setStepToShow} Commands={Commands} />
        <div className="gamemaster-commands">
          {Commands.map((commands, index) =>
            commands.step == stepToShow ? (
              commands.buttons.map((commandButton, index) => (
                <>
                  <div className="command-container">
                    {commandButton.type == "bypass" ? (
                      <Bypass commandButton={commandButton} key={index} />
                    ) : commandButton.type == "sound" ? (
                      <SoundCommand commandButton={commandButton} key={index} />
                    ) : commandButton.type == "video" ||
                      commandButton.type == "image" ? (
                      <MediaCommand
                        commandButton={commandButton}
                        key={index}
                        sendMedia={sendMedia}
                      />
                    ) : (
                      <></>
                    )}
                  </div>
                </>
              ))
            ) : (
              <></>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default GameMasterPage;
