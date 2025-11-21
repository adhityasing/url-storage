-- Create links table if it doesn't exist
CREATE TABLE IF NOT EXISTS links (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(8) UNIQUE NOT NULL,
    target_url TEXT NOT NULL,
    click_count INT DEFAULT 0,
    last_clicked_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Note: The UNIQUE constraint on 'code' automatically creates an index
-- Additional index creation is handled in init.js if needed

