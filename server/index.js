/**
 * @file server/index.js
 * @description This file is the entry point for the server. It sets up the server, middleware, and routes.
 * @author Naz Zaamout
 * @date 2023-10-01
 * @license MIT
 */
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./db.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.get("/test-db", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT 1 + 1 AS result");
    res.json({ success: true, result: rows[0].result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  PORT,
    () => {
      console.log(`Server is running on port ${PORT}`);
    };
});
