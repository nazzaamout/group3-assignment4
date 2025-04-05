/**
 * @file messageController.js
 * @description Controller functions for message board operations.
 */

import pool from "../db.js";
import createDOMPurify from "isomorphic-dompurify";
import { JSDOM } from "jsdom";

// Configure DOMPurify for server-side usage
const window = new JSDOM("").window;
const DOMPurify = createDOMPurify(window);

export const getMessages = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT messages.*, users.username
      FROM messages
      JOIN users ON messages.user_id = users.id
      ORDER BY messages.created_at DESC
    `);

    const messages = rows.map((msg) => ({
      ...msg,
      isOwner: msg.user_id === req.user.id,
    }));

    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};

export const createMessage = async (req, res) => {
  let { content } = req.body;
  const userId = req.user.id;

  if (!content || content.trim() === "") {
    return res.status(400).json({ error: "Message content is required" });
  }

  try {
    // Server-side sanitization to mitigate XSS
    content = DOMPurify.sanitize(content);

    await pool.query("INSERT INTO messages (user_id, content) VALUES (?, ?)", [
      userId,
      content,
    ]);

    res.status(201).json({ success: true });
  } catch (err) {
    console.error("Error posting message:", err);
    res.status(500).json({ error: "Failed to post message" });
  }
};

export const updateMessage = async (req, res) => {
  const { id } = req.params;
  let { content } = req.body;

  if (!content || content.trim() === "") {
    return res.status(400).json({ error: "Message content is required" });
  }

  try {
    content = DOMPurify.sanitize(content);

    // Check if message exists and belongs to the user
    const [rows] = await pool.query("SELECT user_id FROM messages WHERE id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Message not found" });
    }
    if (rows[0].user_id !== req.user.id) {
      return res.status(403).json({ error: "Not authorized to edit this message" });
    }

    await pool.query("UPDATE messages SET content = ? WHERE id = ?", [content, id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update message" });
  }
};

export const deleteMessage = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const [result] = await pool.query("DELETE FROM messages WHERE id = ? AND user_id = ?", [
      id,
      userId,
    ]);

    if (result.affectedRows === 0) {
      return res.status(403).json({ error: "Not authorized to delete this message" });
    }

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete message" });
  }
};
