import mysql from "mysql2";

export const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "huaman2365",
  database: "ClaudiaNeteja"
});

db.connect((err) => {
  if (err) {
    console.error("Error DB:", err);
  } else {
    console.log("MySQL conectado ✅");
  }
});