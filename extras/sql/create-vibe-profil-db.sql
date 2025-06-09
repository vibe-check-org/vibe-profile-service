CREATE ROLE vibe_profile_db_user LOGIN PASSWORD 'VibeCheck10.05.2025';

CREATE DATABASE vibe_profile_db;

GRANT ALL ON DATABASE vibe_profile_db TO vibe_profile_db_user;

CREATE TABLESPACE vibeProfilspace OWNER vibe_profile_db_user LOCATION '/var/lib/postgresql/tablespace/vibe-profile';