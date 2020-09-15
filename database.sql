DROP DATABASE IF EXISTS foodfy;
CREATE DATABASE foodfy

CREATE TABLE "recipes" (
  "id" serial PRIMARY KEY,
  "chef_id" integer NOT NULL,
  "title" text NOT NULL,
  "ingredients" text[] NOT NULL,
  "preparation" text[] NOT NULL,
  "information" text,
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp DEFAULT (now())
);

CREATE TABLE "chefs" (
  "id" serial PRIMARY KEY,
  "name" text NOT NULL,
  "created_at" timestamp DEFAULT (now()),
  "file_id" integer NOT NULL UNIQUE
);

CREATE TABLE "files" (
  "id" serial PRIMARY KEY,
  "name" text NOT NULL,
  "path" text NOT NULL
);

CREATE TABLE "recipe_files" (
  "id" serial PRIMARY KEY,
  "recipe_id" int,
  "file_id" int
);

CREATE TABLE "users" (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  reset_token TEXT,
  reset_token_expires TEXT,
  is_admin BOOLEAN DEFAULT (false),
  created_at TIMESTAMP DEFAULT(now()),
  updated_at TIMESTAMP DEFAULT(now())
);

--session
CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);
ALTER TABLE "session" 
ADD CONSTRAINT "session_pkey" 
PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE recipes ADD COLUMN user_id INTEGER;

--constraints
ALTER TABLE recipes ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "recipes" ADD FOREIGN KEY ("chef_id") REFERENCES "chefs" ("id");

ALTER TABLE "recipe_files" ADD FOREIGN KEY ("recipe_id") REFERENCES "recipes" ("id");

ALTER TABLE "recipe_files" ADD FOREIGN KEY ("file_id") REFERENCES "files" ("id");

ALTER TABLE "chefs" ADD FOREIGN KEY ("file_id") REFERENCES "files" ("id")

-- cascade effect

ALTER TABLE "recipes"
DROP CONSTRAINT recipes_user_id_fkey,
ADD CONSTRAINT recipes_user_id_fkey
FOREIGN KEY ("user_id")
REFERENCES "users" ("id")
ON DELETE CASCADE;

ALTER TABLE "recipes"
DROP CONSTRAINT recipes_chef_id_fkey,
ADD CONSTRAINT recipes_chef_id_fkey
FOREIGN KEY ("chef_id")
REFERENCES "chefs" ("id")
ON DELETE CASCADE;

ALTER TABLE "recipe_files"
DROP CONSTRAINT recipe_files_recipe_id_fkey,
ADD CONSTRAINT recipe_files_recipe_id_fkey
FOREIGN KEY ("recipe_id") REFERENCES "recipes" ("id")
ON DELETE CASCADE;