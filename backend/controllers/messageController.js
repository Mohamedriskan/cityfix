const db = require("../config/db");

exports.getConversations = (req, res) => {
  db.query(
    `SELECT c.*,
       citizen.name AS citizen_name,
       officer.name AS officer_name
     FROM conversations c
     LEFT JOIN users citizen ON c.citizen_id = citizen.id
     LEFT JOIN users officer ON c.officer_id = officer.id
     ORDER BY c.last_updated DESC`,
    (err, convs) => {
      if (err) {
        return res.status(500).json({ success: false, message: "Server error." });
      }

      const convIds = convs.map((c) => c.id);
      if (convIds.length === 0) {
        return res.json({ success: true, conversations: [] });
      }

      db.query(
        `SELECT * FROM chat_messages WHERE conversation_id IN (?) ORDER BY created_at ASC, id ASC`,
        [convIds],
        (msgErr, messages) => {
          if (msgErr) {
            return res.status(500).json({ success: false, message: "Server error." });
          }

          const messagesByConv = {};
          messages.forEach((m) => {
            if (!messagesByConv[m.conversation_id]) messagesByConv[m.conversation_id] = [];
            messagesByConv[m.conversation_id].push({
              id: m.id,
              senderId: m.sender_id,
              senderName: m.sender_name,
              text: m.text,
              timestamp: m.created_at,
            });
          });

          const conversations = convs.map((c) => ({
            id: c.id,
            ticketId: c.ticket_id,
            citizenId: c.citizen_id,
            citizenName: c.citizen_name || "Citizen",
            officerId: c.officer_id,
            officerName: c.officer_name || "Officer",
            lastMessage: c.last_message,
            lastUpdated: c.last_updated,
            unreadCount: c.unread_count || 0,
            messages: messagesByConv[c.id] || [],
          }));

          res.json({ success: true, conversations });
        }
      );
    }
  );
};

exports.sendMessage = (req, res) => {
  const { conversationId, text } = req.body;
  const senderId = req.user.id;
  const senderName = req.user.name || "User";

  if (!conversationId || !text || !text.trim()) {
    return res.status(400).json({ success: false, message: "conversationId and text are required." });
  }

  db.query(
    `INSERT INTO chat_messages (conversation_id, sender_id, sender_name, text) VALUES (?, ?, ?, ?)`,
    [conversationId, senderId, senderName, text],
    (err, result) => {
      if (err) {
        return res.status(500).json({ success: false, message: "Server error." });
      }

      db.query(
        `UPDATE conversations SET last_message = ?, last_updated = NOW() WHERE id = ?`,
        [text, conversationId],
        (updateErr) => {
          if (updateErr) {
            return res.status(500).json({ success: false, message: "Server error." });
          }
          res.status(201).json({
            success: true,
            message: "Message sent successfully",
            messageId: result.insertId,
          });
        }
      );
    }
  );
};
