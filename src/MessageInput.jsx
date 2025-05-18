import React from "react";
import "./MessageInput.css";

const MessageInput = ({ message, setMessage, sendMessage, selectedUser }) => {
  return (
    <div className="message-input-bar">
      <input
        className="message-input"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={`Message ${selectedUser.username}...`}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
      />
      <button className="message-send-btn" onClick={sendMessage}>
        <span role="img" aria-label="Send"><i className="fas fa-paper-plane" /></span>
      </button>
    </div>
  );
};

export default MessageInput;