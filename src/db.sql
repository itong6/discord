CREATE DATABASE my_discord_app;
USE my_discord_app;

CREATE TABLE channels (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255)
);

CREATE TABLE messages (
  id INT PRIMARY KEY AUTO_INCREMENT,
  text TEXT,
  channel_id INT,
  user_name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (channel_id) REFERENCES channels(id)
);