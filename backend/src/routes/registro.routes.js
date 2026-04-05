import express from "express";
import { verifyToken, isAdmin } from "../middleware/auth.middleware.js";

import {
  crearRegistro,
  obtenerMisRegistros,
  editarRegistro,
  eliminarRegistro,
  obtenerCasas,
  obtenerResumenTrabajadores,
  obtenerRegistrosPorUsuario,
  buscarCasas
} from "../controllers/registro.controller.js";

const router = express.Router();

//  CASAS
router.get("/casas", verifyToken, obtenerCasas);
router.get("/casas/buscar", verifyToken, buscarCasas);

//  ADMIN 
router.get("/admin/resumen", verifyToken, isAdmin, obtenerResumenTrabajadores);
router.get("/admin/usuario/:id", verifyToken, isAdmin, obtenerRegistrosPorUsuario);

//  REGISTROS
router.get("/", verifyToken, obtenerMisRegistros);
router.post("/", verifyToken, crearRegistro);

//  EDITAR
router.put("/:id", verifyToken, editarRegistro);

//  ELIMINAR
router.delete("/:id", verifyToken, eliminarRegistro);

export default router;