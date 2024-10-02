import React, { useEffect } from "react";
import "./ChatWindow.css";

const ChatWindow = ({ messages }) => {
  return (
    <div className="messages-list">
      {messages.map((msg, index) => (
        <div className={msg.target} key={index}>
          {msg.content}
        </div>
      ))}
    </div>
  );
};

export default ChatWindow;
