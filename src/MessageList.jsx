import React from "react";
import moment from "moment";
import "./MessageList.css"; // Import the CSS file

const MessageList = ({ messages, messagesEndRef, user, selectedUser }) => {
  return (
    <div className="chat-messages-container">
      {messages.map((msg, idx) => {
        const isOwn = msg.sender === user.username;
        return (
          <div
            key={idx}
            className={`chat-message-row ${isOwn ? "own-message" : "other-message"}`}
          >
            {!isOwn && (
              <div className="chat-avatar">
                {selectedUser.avatar
                  ? <img src={selectedUser.avatar} alt={selectedUser.username} style={{ width: "100%", height: "100%", borderRadius: "50%" }} />
                  : selectedUser.username[0]?.toUpperCase()
                }
              </div>
            )}
            <div className={`chat-bubble ${isOwn ? "own-bubble" : "other-bubble"}`}>
              {!isOwn && (
                <div className="chat-sender">{msg.sender}</div>
              )}
              <div className="chat-text">{msg.text}</div>
              <div className="chat-time">
                {moment(msg.timestamp).format("h:mm A")}
              </div>
            </div>
            {isOwn && (
              <div className="chat-avatar own-avatar">
                {user.avatar
                  ? <img src={user.avatar} alt={user.username} style={{ width: "100%", height: "100%", borderRadius: "50%" }} />
                  : user.username[0]?.toUpperCase()
                }
              </div>
            )}
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;