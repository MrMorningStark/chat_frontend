import React from "react";

const MessageInput = ({ message, setMessage, sendMessage, selectedUser }) => {
  return (
    <div className="input-group">
      <input
        className="form-control"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={`Message ${selectedUser.username}...`}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
      />
      <button className="btn btn-success" onClick={sendMessage}>
        Send
      </button>
    </div>
  );
};

export default MessageInput;