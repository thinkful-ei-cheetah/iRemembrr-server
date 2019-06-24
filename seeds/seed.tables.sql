BEGIN;

SET CLIENT_ENCODING TO 'utf8';

TRUNCATE
  "word",
  "language",
  "user";

INSERT INTO "user" ("id", "username", "name", "password")
VALUES
  (
    1,
    'admin',
    'Dunder Mifflin Admin',
    -- password = "pass"
    '$2a$10$fCWkaGbt7ZErxaxclioLteLUgg4Q3Rp09WW0s/wSLxDKYsaGYUpjG'
  );

INSERT INTO "language" ("id", "name", "user_id")
VALUES
  (1, 'Czech', 1);

INSERT INTO "word" ("id", "language_id", "original", "translation", "next")
VALUES
  (1, 1, 'robot', 'robot', 2),
  (2, 1, 'dobré ráno', 'good morning', 3),
  (3, 1, 'dobrou noc', 'good night', 4),
  (4, 1, 'ahoj', 'hi', 5),
  (5, 1, 'jak se máš', 'how are you', 6),
  (6, 1, 'pupík', 'bellybutton', 7),
  (7, 1, 'pivo', 'beer', 8),
  (8, 1, 'káva', 'coffee', 9),
  (9, 1, 'kočka', 'cat', null);

UPDATE "language" SET head = 1 WHERE id = 1;

-- because we explicitly set the id fields
-- update the sequencer for future automatic id setting
SELECT setval('word_id_seq', (SELECT MAX(id) from "word"));
SELECT setval('language_id_seq', (SELECT MAX(id) from "language"));
SELECT setval('user_id_seq', (SELECT MAX(id) from "user"));

COMMIT;