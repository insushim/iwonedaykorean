-- =============================================================================
-- HaruKorean (하루국어) - D1 Database Schema
-- =============================================================================

DROP TABLE IF EXISTS wrong_notes;
DROP TABLE IF EXISTS sessions;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  display_name TEXT NOT NULL,
  grade INTEGER NOT NULL DEFAULT 1,
  semester INTEGER NOT NULL DEFAULT 1,
  role TEXT NOT NULL DEFAULT 'student',
  parent_linked_to TEXT,
  xp INTEGER NOT NULL DEFAULT 0,
  level INTEGER NOT NULL DEFAULT 1,
  streak INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  streak_freeze_count INTEGER NOT NULL DEFAULT 0,
  total_days_completed INTEGER NOT NULL DEFAULT 0,
  coins INTEGER NOT NULL DEFAULT 0,
  badges TEXT NOT NULL DEFAULT '[]',
  avatar_id TEXT NOT NULL DEFAULT 'default',
  reading_score REAL NOT NULL DEFAULT 0,
  reading_total INTEGER NOT NULL DEFAULT 0,
  reading_correct INTEGER NOT NULL DEFAULT 0,
  literature_score REAL NOT NULL DEFAULT 0,
  literature_total INTEGER NOT NULL DEFAULT 0,
  literature_correct INTEGER NOT NULL DEFAULT 0,
  grammar_score REAL NOT NULL DEFAULT 0,
  grammar_total INTEGER NOT NULL DEFAULT 0,
  grammar_correct INTEGER NOT NULL DEFAULT 0,
  last_study_date TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  grade INTEGER NOT NULL,
  semester INTEGER NOT NULL,
  date TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'in_progress',
  passages_data TEXT NOT NULL DEFAULT '[]',
  grammar_questions_data TEXT NOT NULL DEFAULT '[]',
  total_questions INTEGER NOT NULL DEFAULT 0,
  correct_on_first_try INTEGER NOT NULL DEFAULT 0,
  total_attempts INTEGER NOT NULL DEFAULT 0,
  xp_earned INTEGER NOT NULL DEFAULT 0,
  coins_earned INTEGER NOT NULL DEFAULT 0,
  started_at TEXT NOT NULL DEFAULT (datetime('now')),
  completed_at TEXT,
  time_spent_seconds INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE wrong_notes (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  session_id TEXT NOT NULL,
  question_id TEXT NOT NULL,
  passage_title TEXT,
  question TEXT NOT NULL,
  correct_answer INTEGER NOT NULL,
  student_answer INTEGER NOT NULL,
  explanation TEXT NOT NULL,
  wrong_explanation TEXT,
  category TEXT NOT NULL,
  domain TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  reviewed INTEGER NOT NULL DEFAULT 0,
  reviewed_at TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE
);

CREATE INDEX idx_sessions_user_date ON sessions(user_id, date);
CREATE INDEX idx_wrong_notes_user ON wrong_notes(user_id);
CREATE INDEX idx_users_email ON users(email);
