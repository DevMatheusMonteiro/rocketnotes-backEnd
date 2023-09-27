import sqlite3 from "sqlite3";
import * as sqlite from "sqlite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("__filename: " + __filename);
console.log("__dirname: " + __dirname);

console.log(import.meta);

async function sqliteConnection() {
  const database = await sqlite.open({
    filename: path.resolve(__dirname, "..", "database.db"),
    driver: sqlite3.Database,
  });

  return database;
}

export default sqliteConnection;
