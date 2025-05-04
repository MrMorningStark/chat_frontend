import React from "react";
import moment from "moment";

const MessageList = ({ messages, messagesEndRef, user }) => {
  return (
    <div
      className="flex-grow-1 border rounded p-3 mb-3 bg-light"
      style={{ overflowY: "auto", maxHeight: "70vh" }}
    >
      {messages.map((msg, idx) => (
        <div
          key={idx}
          className={`d-flex mb-2 ${
            msg.sender === user.username ? "justify-content-end" : "justify-content-start"
          }`}
        >
          <div
            className={`p-2 rounded ${
              msg.sender === user.username ? "bg-primary text-white" : "bg-white border"
            }`}
            style={{ maxWidth: "75%" }}
          >
            <strong>{msg.sender}</strong>
            <div>{msg.text}</div>
            <small className="text-muted d-block mt-1" style={{ fontSize: "0.8rem" }}>
              {moment(msg.timestamp).format("h:mm A")}
            </small>
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;