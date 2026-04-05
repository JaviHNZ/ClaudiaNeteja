import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./src/routes/auth.routes.js";
import testRoutes from "./src/routes/test.routes.js";
import registrosRoutes from "./src/routes/registro.routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Ruta base
app.get("/", (req, res) => {
  res.send("API funcionando 🔥");
});

app.use("/api/test", testRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/registros", registrosRoutes);

// Puerto
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});