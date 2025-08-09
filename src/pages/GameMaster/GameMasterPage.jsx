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
  const [targetOverride, setTargetOverride] = useState(null);
  // Notification sound controls
  const [notifVolume, setNotifVolume] = useState(0.6);
  const [audioReady, setAudioReady] = useState(false);
  const audioRef = React.useRef(null);

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
        if (messageData.type == "chat" || messageData.type == "playerchat") {
          console.log("Received message:", messageData);
          setMessages((prevMessages) => [...prevMessages, messageData]);
          // Play notification only for player-originated chat
          if (audioRef.current && messageData.type === "playerchat") {
            try {
              audioRef.current.currentTime = 0;
              audioRef.current.play();
            } catch (e) {
              // Ignore autoplay errors; will succeed after first user gesture
              console.warn("Unable to play notification sound yet.");
            }
          }
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

  // Préparation/MAJ du son de notification
  useEffect(() => {
    if (!audioRef.current) {
      const el = new Audio("/sound/jingle.mp3");
      el.volume = notifVolume;
      el.addEventListener("canplaythrough", () => setAudioReady(true), {
        once: true,
      });
      audioRef.current = el;
    } else {
      audioRef.current.volume = notifVolume;
    }
  }, [notifVolume]);

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
  function sendMessage(text, target) {
    if (targetOverride) {
      target = targetOverride;
    }
    const messageToSend = { type: "chat", target: target, content: text };
    ws.send(JSON.stringify(messageToSend));
    addToMessages(messageToSend);
  }

  /**
   * Envoie un nouveau média au server
   * @param {string} media URL du média
   */
  function sendMedia(media) {
    ws.send(
      JSON.stringify({ type: "media", target: "tablet", content: media })
    );
  }

  /**
   * Supprime les messages de la liste des messages.
   * Envoie l'information au serveur pour les supprimer ailleurs si besoin
   */
  function resetChat() {
    ws.send(JSON.stringify({ type: "reset-chat", target: "all" }));
    setMessages([]);
  }

  const handleCheckboxChange = (event) => {
    setTargetOverride(event.target.checked ? "player" : null);
  };

  return (
    <div id="gamemaster-page">
      <div className="gamemaster-clues">
        <ChronometerComponent />
        <ChatWindow messages={messages} />
        <div className="notification-controls" style={{ margin: "8px 0" }}>
          <label>
            Volume
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={notifVolume}
              onChange={(e) => setNotifVolume(parseFloat(e.target.value))}
              style={{ marginLeft: 8, verticalAlign: "middle" }}
            />
          </label>
        </div>
        <label>
          <input
            type="checkbox"
            checked={targetOverride === "player"}
            onChange={handleCheckboxChange}
          />
          Uniquement écran player
        </label>
        <MessageInput
          onSend={sendMessage}
          textarea={false}
          sendButton={false}
          playJingle={false}
        />
        <button onClick={() => resetChat()}>Reset Chat</button>
      </div>
      <div className="gamemaster-game-track">
        <Nav setStepToShow={setStepToShow} Commands={Commands} />
        <div className="gamemaster-commands">
          {Commands.map((commands, index) =>
            commands.step == stepToShow ? (
              // Support either legacy `buttons` array or new `sections` array
              commands.sections && Array.isArray(commands.sections) ? (
                commands.sections.map((section, sIdx) => (
                  <div className="command-section" key={`section-${sIdx}`}>
                    {section.title ? (
                      <h3 className="command-section-title">{section.title}</h3>
                    ) : null}
                    <div className="command-section-content">
                      {section.buttons?.map((commandButton, bIdx) => (
                        <div className="command-container" key={`btn-${bIdx}`}>
                          {commandButton.type == "bypass" ? (
                            <Bypass commandButton={commandButton} />
                          ) : commandButton.type == "sound" ? (
                            <SoundCommand commandButton={commandButton} />
                          ) : commandButton.type == "video" ||
                            commandButton.type == "image" ? (
                            <MediaCommand
                              commandButton={commandButton}
                              sendMedia={sendMedia}
                            />
                          ) : null}
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                // If no sections provided, auto-group into sections by type
                (() => {
                  const sounds = (commands.buttons || []).filter(
                    (b) => b.type === "sound"
                  );
                  const media = (commands.buttons || []).filter(
                    (b) => b.type === "video" || b.type === "image"
                  );
                  const other = (commands.buttons || []).filter(
                    (b) => b.type !== "sound" && b.type !== "video" && b.type !== "image"
                  );
                  return (
                    <>
                      {sounds.length > 0 && (
                        <div className="command-section" key={`auto-sounds`}>
                          <h3 className="command-section-title">Sons</h3>
                          <div className="command-section-content">
                            {sounds.map((commandButton, bIdx) => (
                              <div className="command-container" key={`sound-${bIdx}`}>
                                <SoundCommand commandButton={commandButton} />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {media.length > 0 && (
                        <div className="command-section" key={`auto-media`}>
                          <h3 className="command-section-title">Médias</h3>
                          <div className="command-section-content">
                            {media.map((commandButton, bIdx) => (
                              <div className="command-container" key={`media-${bIdx}`}>
                                <MediaCommand
                                  commandButton={commandButton}
                                  sendMedia={sendMedia}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {other.length > 0 && (
                        <div className="command-section" key={`auto-other`}>
                          <h3 className="command-section-title">Autres</h3>
                          <div className="command-section-content">
                            {other.map((commandButton, bIdx) => (
                              <div className="command-container" key={`other-${bIdx}`}>
                                {commandButton.type == "bypass" ? (
                                  <Bypass commandButton={commandButton} />
                                ) : null}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  );
                })()
              )
            ) : null
          )}
        </div>
      </div>
    </div>
  );
};

export default GameMasterPage;
