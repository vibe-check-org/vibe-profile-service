CREATE SCHEMA IF NOT EXISTS vibe_profile_schema AUTHORIZATION vibe_profile_db_user;

ALTER ROLE vibe_profile_db_user SET search_path = 'vibe_profile_schema';