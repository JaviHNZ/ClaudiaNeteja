import jwt from "jsonwebtoken";

const SECRET = "secret123";

// 🔐 VERIFICAR TOKEN
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(403).json({ message: "Token requerido" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(403).json({ message: "Token inválido" });
  }

  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Token inválido" });
    }

    req.user = decoded; // 🔥 aquí tienes id y rol
    next();
  });
};

// 👑 SOLO ADMIN
export const isAdmin = (req, res, next) => {
  if (req.user.rol !== "admin") {
    return res.status(403).json({ message: "Solo admin" });
  }
  next();
};

// 👷 SOLO TRABAJADOR (opcional)
export const isTrabajador = (req, res, next) => {
  if (req.user.rol !== "trabajador") {
    return res.status(403).json({ message: "Solo trabajadores" });
  }
  next();
};