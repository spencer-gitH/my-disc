CREATE DATABASE discbuddy;

CREATE TABLE discs (
  id VARCHAR(255) PRIMARY KEY,
  user_email VARCHAR(255),
  img_encoded TEXT,
  stability VARCHAR(255),
  category VARCHAR(255),
  brand VARCHAR(255),
  disc_name VARCHAR(255),
  speed INT,
  glide INT,
  turn INT,
  fade INT,
  date VARCHAR(300)
);

CREATE TABLE users (
  email VARCHAR(255) PRIMARY KEY,
  hashed_password VARCHAR(255)
);