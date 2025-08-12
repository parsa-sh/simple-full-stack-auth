import { Pool } from "pg";

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "users",
  password: "parsa",
  port: 5432,
});

export default pool;
