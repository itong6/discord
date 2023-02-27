import { useState, useEffect } from "react";
import { getPool } from "../lib/db";

export default function Home() {
  const [channels, setChannels] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newChannelName, setNewChannelName] = useState("");
  const [currentChannelId, setCurrentChannelId] = useState(null);
  const [currentChannelName, setCurrentChannelName] = useState("");

  async function fetchChannels() {
    try {
      const pool = await getPool();
      const [rows] = await pool.query("SELECT * FROM channels");
      setChannels(rows);
    } catch (err) {
      console.error("Error fetching channels:", err);
    }
  }

  async function fetchMessages(channelId) {
    const pool = await getPool();
    const [rows] = await pool.query(
      "SELECT * FROM messages WHERE channel_id = ?",
      [channelId]
    );
    setMessages(rows);
  }

  async function handleChannelClick(channelId, channelName) {
    setCurrentChannelId(channelId);
    setCurrentChannelName(channelName);
    await fetchMessages(channelId);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const pool = await getPool();
      const [result] = await pool.query(
        "INSERT INTO channels (name) VALUES (?)",
        [newChannelName]
      );
      setChannels([...channels, { id: result.insertId, name: newChannelName }]);
      setNewChannelName("");
    } catch (err) {
      console.error("Error inserting new channel:", err);
    }
    console.log("Channels after adding new channel:", channels);
  }

  async function handleMessageSubmit(e) {
    e.preventDefault();
    try {
      const pool = await getPool();
      const [result] = await pool.query(
        "INSERT INTO messages (channel_id, user_name, text) VALUES (?, ?, ?)",
        [currentChannelId, "Alice", newMessageText]
      );
      setMessages([
        ...messages,
        { id: result.insertId, user_name: "Alice", text: newMessageText },
      ]);
      setNewMessageText("");
    } catch (err) {
      console.error("Error inserting new message:", err);
    }
  }

  const [newMessageText, setNewMessageText] = useState("");

  useEffect(() => {
    fetchChannels();
  }, []);

  return (
    <div>
      <h1>My Discord App</h1>
      <div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={newChannelName}
            onChange={(e) => setNewChannelName(e.target.value)}
          />
          <button type="submit">Create Channel</button>
        </form>
        {channels.map((channel) => (
          <div
            key={channel.id}
            onClick={() => handleChannelClick(channel.id, channel.name)}
          >
            {channel.name}
          </div>
        ))}
      </div>
      {currentChannelId && (
        <div>
          <h2>{currentChannelName}</h2>
          <div>
            {messages.map((message) => (
              <div key={message.id}>
                <div>{message.user_name}</div>
                <div>{message.text}</div>
              </div>
            ))}
          </div>
          <form onSubmit={handleMessageSubmit}>
            <input
              type="text"
              value={newMessageText}
              onChange={(e) => setNewMessageText(e.target.value)}
            />
            <button type="submit">Send</button>
          </form>
        </div>
      )}
    </div>
  );
}
