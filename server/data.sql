CREATE DATABASE discbuddy;

CREATE TABLE discs (
  id VARCHAR(255) PRIMARY KEY,
  user_email VARCHAR(255),
  img_encoded TEXT,
  stability VARCHAR(255),
  category VARCHAR(255),
  brand VARCHAR(255),
  disc_name VARCHAR(255),
  speed NUMERIC(4,1),
  glide NUMERIC(4,1),
  turn NUMERIC(4,1),
  fade NUMERIC(4,1),
  date VARCHAR(300)
);

CREATE TABLE users (
  email VARCHAR(255) PRIMARY KEY,
  hashed_password VARCHAR(255)
);
