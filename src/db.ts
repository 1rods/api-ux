import { Pool } from "pg";

export const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "api-ux",
  password: "123",
  port: 5432,
});
