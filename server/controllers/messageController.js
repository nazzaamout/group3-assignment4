import db from "../db.js";

// Get all messages
export const getMessages = async (req, res) => {
  try {
    const [rows] = await db.query(`
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

// Post new message
export const createMessage = async (req, res) => {
  const { content } = req.body;
  const userId = req.user.id;

  if (!content || content.trim() === "") {
    return res.status(400).json({ error: "Message content is required" });
  }

  try {
    await db.query("INSERT INTO messages (user_id, content) VALUES (?, ?)", [
      userId,
      content,
    ]);
    res.status(201).json({ success: true });
  } catch (err) {
    console.error("Error posting message:", err);
    res.status(500).json({ error: "Failed to post message" });
  }
};

// Delete message
export const deleteMessage = async (req, res) => {
  const messageId = req.params.id;
  const userId = req.user.id;

  try {
    const [result] = await db.query(
      "DELETE FROM messages WHERE id = ? AND user_id = ?",
      [messageId, userId]
    );

    if (result.affectedRows === 0) {
      return res
        .status(403)
        .json({ error: "Not authorized to delete this message" });
    }

    res.json({ success: true });
  } catch (err) {
    console.error("Error deleting message:", err);
    res.status(500).json({ error: "Failed to delete message" });
  }
};
