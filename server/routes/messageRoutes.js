import express from "express";
import authenticateToken from "../middlewares/authMiddleware.js";
import {
  getMessages,
  createMessage,
  deleteMessage,
} from "../controllers/messageController.js";
import db from "../db.js";

const router = express.Router();

router.get("/", authenticateToken, getMessages);
router.post("/", authenticateToken, createMessage);
router.delete("/:id", authenticateToken, deleteMessage);

// Update a message (only if owned by the user)
router.put("/:id", authenticateToken, async (req, res) => {
  const messageId = req.params.id;
  const userId = req.user.id;
  const { content } = req.body;

  if (!content || content.trim() === "") {
    return res.status(400).json({ error: "Message content is required" });
  }

  try {
    const [result] = await db.query(
      "UPDATE messages SET content = ? WHERE id = ? AND user_id = ?",
      [content, messageId, userId]
    );

    if (result.affectedRows === 0) {
      return res
        .status(403)
        .json({ error: "Not authorized to edit this message" });
    }

    res.json({ success: true });
  } catch (err) {
    console.error("Error updating message:", err);
    res.status(500).json({ error: "Failed to update message" });
  }
});

export default router;
