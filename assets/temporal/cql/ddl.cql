CREATE TABLE IF NOT EXISTS schema_version(
 keyspace_name text PRIMARY KEY,
 creation_time timestamp,
 curr_version text,
 min_compatible_version text);

CREATE TABLE IF NOT EXISTS schema_update_history(
 year int,
 month int,
 update_time timestamp,
 description text,
 manifest_md5 text, 
 new_version text,
 old_version text,
 PRIMARY KEY ((year, month), update_time));

 


