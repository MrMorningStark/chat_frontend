import React from "react";

const UserList = ({ users, selectUser }) => {
  return (
    <div className="mb-3">
      <h5>Select a user to chat with:</h5>
      <ul className="list-group">
        {users.map((user) => (
          <li
            key={user.username}
            className="list-group-item list-group-item-action"
            onClick={() => selectUser(user)}
            style={{ cursor: "pointer" }}
          >
            {user.username}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;