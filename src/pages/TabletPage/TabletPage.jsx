import React, { useState, useEffect } from "react";
import ChatWindow from "../../components/ChatWindow/ChatWindow";
import MediaDisplay from "../../components/MediaDisplay/MediaDisplay";
import MessageInput from "../../components/MessageInput/MessageInput";
import useFullScreen from "../../hooks/FullScreen";
import useDisableShortcuts from "../../hooks/DisableShortcuts";
import "./TabletPage.css";
import video from "../../assets/background.mp4";
import { mainUrl } from "../../config/config";

const TabletPage = () => {
  useFullScreen();
  useDisableShortcuts();

  const [messages, setMessages] = useState([]);
  const [tempMedia, setTempMedia] = useState(null);
  const [media, setMedia] = useState(null);
  const [ws, setWs] = useState(null);

  const WS_URL = `ws://${mainUrl}:8080`;

  useEffect(() => {
    if (messages.length > 4) {
      setMessages((prevMessages) => [...prevMessages.slice(1)]);
    }
    // On ramène le scroll tout en bas
    const messageBody = document.querySelector("#messages-list");
    if (messageBody) {
      messageBody.scrollTop =
        messageBody.scrollHeight - messageBody.clientHeight;
    }
  }, [messages]);

  // A chaque changement de tempMedia on modifie Media
  useEffect(() => {
    setMedia(tempMedia);
  }, [tempMedia]);

  /**
   * Gestion de la réception des messages avec Websocket
   */
  useEffect(() => {
    const socket = new WebSocket(WS_URL);
    setWs(socket);

    socket.onmessage = async (event) => {
      console.log("TABLET RECEIVED MESSAGE : ");
      let data = event.data;

      // Check if the data is a Blob
      if (data instanceof Blob) {
        data = await data.text();
      }
      try {
        const messageData = JSON.parse(data);
        console.log("Received message:", messageData);
        if (messageData.type == "chat") {
          addToMessages(messageData);
          setMedia(null);
        } else if (messageData.type == "media") {
          // Utilisation de tempMedia pour pouvoir envoyer des medias l'un après l'autre en remettant media à null
          setTempMedia(messageData.content);
          setMedia(null);
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
    setMessages((prevMessages) => [...prevMessages, message]);
  }

  return (
    <div id="tablet-page">
      <img src={avatar} alt="Avatar Sivrage" className="bot-avatar" />
      <video autoPlay muted loop id="background-video">
        <source src={video} type="video/mp4" />
      </video>
      {media ? <MediaDisplay media={media} /> : <></>}
      <div className="tablet-page-content">
        {media ? (
          <></>
        ) : (
          <>
            <ChatWindow messages={messages} />
            <div className="bot-name">Sivrage</div>
          </>
        )}
      </div>
    </div>
  );
};

export default TabletPage;
