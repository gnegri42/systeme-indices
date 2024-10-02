import React, { useState, useEffect } from "react";
import ChatWindow from "../../components/ChatWindow/ChatWindow";
import MediaDisplay from "../../components/MediaDisplay/MediaDisplay";
import MessageInput from "../../components/MessageInput/MessageInput";
import useFullScreen from "../../hooks/FullScreen";
import useDisableShortcuts from "../../hooks/DisableShortcuts";
import "./PlayerPage.css";
import video from "../../assets/background-video.mp4";
import avatar from "../../assets/sivrage_avatar.png";

const PlayerPage = () => {
  useFullScreen();
  useDisableShortcuts();

  const [messages, setMessages] = useState([]);
  const [media, setMedia] = useState(null);
  const [ws, setWs] = useState(null);
  const [loading, setLoading] = useState(false);

  const WS_URL = "ws://localhost:8080";

  /**
   * Gestion de la réception des messages avec Websocket
   */
  useEffect(() => {
    const socket = new WebSocket(WS_URL);
    setWs(socket);

    socket.onmessage = async (event) => {
      console.log("PLAYER RECEIVED MESSAGE : ");
      let data = event.data;

      // Check if the data is a Blob
      if (data instanceof Blob) {
        data = await data.text();
      }
      try {
        const messageData = JSON.parse(data);
        console.log("Received message:", messageData);
        setLoading(false);
        if (messageData.type == "chat") {
          addToMessages(messageData);
          setMedia(null);
        } else if (messageData.type == "media") {
          setMedia(messageData.content);
        } else if (messageData.type == "reset-chat") {
          setMessages([]);
        }
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
    if (messages.length >= 4) {
      setMessages((prevMessages) => [...prevMessages.slice(1), message]);
    } else {
      setMessages((prevMessages) => [...prevMessages, message]);
    }
  }

  /**
   * Envoie le message au server avec Websocket et l'ajoute dans la liste pour l'afficher.
   * Active le message de chargement à l'envoi du message
   * @param {string} message
   */
  function sendMessage(message) {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: "chat", target: "gm", content: message }));
      addToMessages({ type: "chat", target: "gm", content: message });
      setLoading(true);
    }
  }

  return (
    <div id="player-page">
      <img src={avatar} alt="Avatar Sivrage" className="bot-avatar" />
      <video autoPlay muted loop id="background-video">
        <source src={video} type="video/mp4" />
      </video>
      {media ? <MediaDisplay media={media} /> : <></>}
      <div className="player-page-content">
        {media ? (
          <></>
        ) : (
          <>
            <ChatWindow messages={messages} />
            <MessageInput onSend={sendMessage} autofocus={true} />
            {loading ? (
              <div className="loader-container">
                <span className="loader-text">Analyse en cours</span>
                <div className="loader"></div>
              </div>
            ) : (
              <></>
            )}
          </>
        )}
        <div className="bot-name">Sivrage</div>
      </div>
    </div>
  );
};

export default PlayerPage;
