-- =====================================
-- CityFix Migration 001
-- Adds notifications, conversations, and chat_messages tables.
-- =====================================

USE cityfix;

-- Notifications table (per-user + campaign broadcasts)
CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    text VARCHAR(500) NOT NULL,
    type VARCHAR(20) DEFAULT 'info',
    ticket_id VARCHAR(50) DEFAULT NULL,
    issue_id INT DEFAULT NULL,
    is_campaign BOOLEAN DEFAULT 0,
    is_read BOOLEAN DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Conversations (officer <-> citizen chat threads)
CREATE TABLE IF NOT EXISTS conversations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ticket_id VARCHAR(50),
    citizen_id INT,
    officer_id INT,
    last_message VARCHAR(500),
    last_updated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    unread_count INT DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Individual chat messages
CREATE TABLE IF NOT EXISTS chat_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    conversation_id INT NOT NULL,
    sender_id INT NOT NULL,
    sender_name VARCHAR(100),
    text TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
);

-- =====================================
-- End of Migration 001
-- =====================================
