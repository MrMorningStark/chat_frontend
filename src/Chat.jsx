import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import axios from "axios";
import { useAuth } from "./auth";
import UserList from "./UserList";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import "./Chat.css"; // Add this for custom styles

const socket = io("http://localhost:5000");

const Chat = () => {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const { user, logout } = useAuth();
    const messagesEndRef = useRef(null);

    useEffect(() => {
        socket.emit("register", user.username);

        const fetchUsers = async () => {
            setLoading(true);
            try {
                const response = await axios.get("http://localhost:5000/api/users", {
                    headers: { username: user.username },
                });
                setUsers(response.data.filter((u) => u.username !== user.username));
            } catch (err) {
                console.error("Failed to fetch users", err);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();

        socket.on("private message", (msg) => {
            if (selectedUser && msg.sender === selectedUser.username) {
                setMessages((prev) => [...prev, msg]);
            }
        });

        return () => {
            socket.off("private message");
        };
    }, [user.username, selectedUser]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const selectUser = (selectedUser) => {
        setSelectedUser(selectedUser);
        setMessages([]);
        setLoading(true);

        const fetchConversation = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/messages/conversation", {
                    params: { user1: user.username, user2: selectedUser.username },
                    headers: { username: user.username },
                });
                setMessages(response.data);
            } catch (err) {
                console.error("Failed to fetch conversation", err);
            } finally {
                setLoading(false);
            }
        };

        fetchConversation();
    };

    const sendMessage = () => {
        if (!message.trim() || !selectedUser) return;
        const msg = {
            sender: user.username,
            receiver: selectedUser.username,
            text: message,
            timestamp: new Date(),
        };
        socket.emit("private message", msg);
        setMessages((prev) => [...prev, msg]);
        setMessage("");
    };

    const goBack = () => {
        setSelectedUser(null);
        setMessages([]);
    };

    // Responsive: show both panes on large screens, only one on small screens
    return (
        <div className="chat-app-container">
            <div className="chat-header">
                <div className="chat-header-user">
                    <div className="chat-header-avatar">
                        {user.avatar
                            ? <img src={user.avatar} alt={user.username} />
                            : user.username[0]?.toUpperCase()}
                    </div>
                    <span className="chat-header-username">{user.username}</span>
                </div>
                <button className="btn btn-danger" onClick={logout}>
                    Logout
                </button>
            </div>
            <div className="chat-main">
                <div className={`chat-sidebar${selectedUser ? " hide-on-mobile" : ""}`}>
                    <UserList users={users} selectUser={selectUser} activeUser={selectedUser} />
                </div>
                <div className={`chat-content${selectedUser ? " show" : ""}`}>
                    {loading && !messages.length ? (
                        <div className="text-center">
                            <i className="fas fa-spinner fa-spin fa-3x"></i>
                            <p>Loading...</p>
                        </div>
                    ) : selectedUser ? (
                        <>
                            <div className="chat-content-header">
                                <button
                                    className="chat-back-btn"
                                    onClick={goBack}
                                    style={{ display: window.innerWidth <= 768 ? "inline-flex" : "none" }}
                                    aria-label="Back"
                                >
                                    <i className="fas fa-chevron-left" />
                                </button>
                                <div className="chat-content-user">
                                    <div className="chat-avatar">
                                        {selectedUser.avatar
                                            ? <img src={selectedUser.avatar} alt={selectedUser.username} />
                                            : selectedUser.username[0]?.toUpperCase()}
                                        <span
                                            className="chat-online-dot"
                                            style={{
                                                background: selectedUser.online ? "#25d366" : "#bdbdbd",
                                            }}
                                        ></span>
                                    </div>
                                    <div>
                                        <div>{selectedUser.username}</div>
                                        <div style={{ fontSize: "0.85em", color: "#888" }}>
                                            {selectedUser.online
                                                ? "Online"
                                                : selectedUser.lastSeen
                                                    ? `Last seen ${require("moment")(selectedUser.lastSeen).fromNow()}`
                                                    : "Offline"}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <MessageList messages={messages} messagesEndRef={messagesEndRef} user={user} selectedUser={selectedUser} />
                            <MessageInput
                                message={message}
                                setMessage={setMessage}
                                sendMessage={sendMessage}
                                selectedUser={selectedUser}
                            />
                        </>
                    ) : (
                        <div className="d-none d-md-flex align-items-center justify-content-center h-100 w-100 text-muted">
                            <h5>Select a chat to start messaging</h5>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Chat;
