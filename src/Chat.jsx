import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import axios from "axios";
import { useAuth } from "./auth";
import UserList from "./UserList";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

const socket = io("https://chat-nodejs-t4wh.onrender.com");

const Chat = () => {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const { user, logout } = useAuth();
    const messagesEndRef = useRef(null);

    useEffect(() => {
        // Register the user with the socket
        socket.emit("register", user.username);

        // Fetch all users
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const response = await axios.get("https://chat-nodejs-t4wh.onrender.com/api/users", {
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

        // Listen for private messages
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
        // Scroll to the bottom when messages are updated
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const selectUser = (selectedUser) => {
        setSelectedUser(selectedUser);
        setMessages([]);
        setLoading(true);

        // Fetch all messages for the selected user
        const fetchConversation = async () => {
            try {
                const response = await axios.get("https://chat-nodejs-t4wh.onrender.com/api/messages/conversation", {
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

    return (
        <div className="container mt-4 d-flex flex-column" style={{ height: "90vh" }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h4>
                    👋 Welcome, <strong>{user.username}</strong>
                </h4>
                <button className="btn btn-danger" onClick={logout}>
                    Logout
                </button>
            </div>

            {loading && !messages.length ? (
                <div className="text-center">
                    <i className="fas fa-spinner fa-spin fa-3x"></i>
                    <p>Loading...</p>
                </div>
            ) : !selectedUser ? (
                <UserList users={users} selectUser={selectUser} />
            ) : (
                <>
                    <MessageList messages={messages} messagesEndRef={messagesEndRef} user={user} />
                    <MessageInput
                        message={message}
                        setMessage={setMessage}
                        sendMessage={sendMessage}
                        selectedUser={selectedUser}
                    />
                    <button className="btn btn-secondary mt-3" onClick={goBack}>
                        Back to User List
                    </button>
                </>
            )}
        </div>
    );
};

export default Chat;
