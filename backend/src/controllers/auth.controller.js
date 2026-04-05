import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../config/db.js";

// 🔥 REGISTER (guardar usuario en MySQL)
export const register = (req, res) => {
  const { nombre, email, password } = req.body;

  // 🔥 VALIDACIONES
  if (!nombre || !email || !password) {
    return res.status(400).json({ message: "Todos los campos son obligatorios" });
  }

  if (!email.includes("@")) {
    return res.status(400).json({ message: "Email inválido" });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: "Mínimo 6 caracteres" });
  }

  // 🔐 HASH
  const hashedPassword = bcrypt.hashSync(password, 10);

  const sql = `
    INSERT INTO usuarios (nombre, email, password, rol)
    VALUES (?, ?, ?, ?)
  `;

  db.query(
    sql,
    [nombre, email, hashedPassword, "trabajador"],
    (err, result) => {
      if (err) {
        console.error("Error al registrar:", err);

        if (err.code === "ER_DUP_ENTRY") {
          return res.status(400).json({ message: "Email ya registrado" });
        }

        return res.status(500).json({ message: "Error del servidor" });
      }

      res.json({
        message: "Usuario creado ✅",
        userId: result.insertId
      });
    }
  );
};

// 🔥 LOGIN (leer usuario desde MySQL)
export const login = (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM usuarios WHERE email = ?";

  db.query(sql, [email], (err, results) => {
    if (err) {
      console.error("Error login:", err);
      return res.status(500).json({ message: "Error del servidor" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const user = results[0];

    // 🔐 comprobar contraseña
    const valid = bcrypt.compareSync(password, user.password);

    if (!valid) {
      return res.status(400).json({ message: "Contraseña incorrecta" });
    }

    // 🔑 generar token
    const token = jwt.sign(
      {
        id: user.id,
        rol: user.rol
      },
      "secret123", // luego lo puedes pasar a .env
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login correcto ✅",
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        rol: user.rol
      }
    });
  });
};
