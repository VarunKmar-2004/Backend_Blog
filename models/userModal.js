const pool = require("../config/db");

const createUser = async (name, email, password,profile_picture,about) => {
  const query = "INSERT INTO users (name, email, password,profile_picture,about) VALUES (?, ?, ?, ?, ?)";
  const [result] = await pool.query(query, [name, email, password,profile_picture,about]); // ✅ Use `await`
  return result;
};

const getUserByEmail = async (email) => {
  const query = "SELECT * FROM users WHERE email = ?";
  const [rows] = await pool.query(query, [email]); // ✅ Use `await`
  return rows[0]; // Return first user found
};


module.exports = { createUser, getUserByEmail };
