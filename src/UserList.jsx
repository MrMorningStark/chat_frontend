import React from "react";
import "./UserList.css";
import moment from "moment";

const UserList = ({ users, selectUser, activeUser }) => {
  return (
    <div className="userlist-sidebar">
      <h4 className="userlist-title">Chats</h4>
      <ul className="userlist-list">
        {users.map((user) => (
          <li
            key={user.username}
            className={`userlist-item${activeUser && activeUser.username === user.username ? " active" : ""
              }`}
            onClick={() => selectUser(user)}
          >
            <div className="userlist-avatar">
              {user.avatar
                ? <img src={user.avatar} alt={user.username} style={{ width: "100%", height: "100%", borderRadius: "50%" }} />
                : user.username[0]?.toUpperCase()
              }
              {/* Status dot */}
              <span
                style={{
                  display: "inline-block",
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: user.online ? "#25d366" : "#bdbdbd",
                  border: "2px solid #fff",
                  position: "absolute",
                  bottom: 2,
                  right: 2,
                }}
              />
            </div>
            <span className="userlist-name">{user.username}</span>
            <span className="userlist-status" style={{ fontSize: "0.8em", color: "#888", marginLeft: 8 }}>
              {user.online
                ? "Online"
                : user.lastSeen
                  ? `Last seen ${moment(user.lastSeen).fromNow()}`
                  : "Offline"}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;