CREATE TABLE IF NOT EXISTS users(
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,

    verified INTEGER DEFAULT 0,

    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS sessions(
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,

    refresh_token_hash TEXT NOT NULL,

    device_name TEXT,
    ip_address TEXT,

    created_at TEXT,
    expires_at TEXT,

    revoked INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS notifications(
    id TEXT PRIMARY KEY,

    user_id TEXT,

    title TEXT,

    body TEXT,

    read INTEGER DEFAULT 0,

    created_at TEXT
);

CREATE TABLE IF NOT EXISTS login_attempts(

    id TEXT PRIMARY KEY,

    email TEXT,

    ip_address TEXT,

    attempts INTEGER DEFAULT 0,

    locked_until TEXT
);
