CREATE TABLE IF NOT EXISTS ballots (
  campaign  TEXT NOT NULL,
  edition   TEXT NOT NULL,
  handle    TEXT NOT NULL CHECK (length(handle) = 64),
  choice    TEXT NOT NULL CHECK (choice IN ('up', 'down')),
  PRIMARY KEY (campaign, edition, handle)
) WITHOUT ROWID;
