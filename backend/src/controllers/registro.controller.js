import { db } from "../../src/config/db.js";


const casas = [
  { id: 1, nombre: "Casa Maria", horas: 5, precio: 10 },
  { id: 2, nombre: "Casa Laura", horas: 3, precio: 12 }
];
//  OBTENER CASAS
export const obtenerCasas = (req, res) => {
  res.json(casas);
};
//  CREAR REGISTRO
export const crearRegistro = (req, res) => {
  const usuario_id = req.user.id;
  const { fecha, horas, casa_id } = req.body;

  const sql = `
    INSERT INTO registros (usuario_id, casa_id, fecha, horas)
    VALUES (?, ?, ?, ?)
  `;

  db.query(sql, [usuario_id, casa_id, fecha, horas], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json(err);
    }

    res.json({
      message: "Registro guardado ✅",
      data: {
        id: result.insertId,
        usuario_id,
        fecha,
        horas,
        casa_id
      }
    });
  });
};

//  OBTENER MIS REGISTROS
export const obtenerMisRegistros = (req, res) => {
  const usuario_id = req.user.id;

  const sql = `
    SELECT r.id, r.fecha, r.horas, r.casa_id, c.nombre as casa_nombre
    FROM registros r
    LEFT JOIN casas c ON r.casa_id = c.id
    WHERE r.usuario_id = ?
    ORDER BY r.fecha DESC
  `;

  db.query(sql, [usuario_id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json(err);
    }

    res.json(results);
  });
};
//  EDITAR REGISTRO
export const editarRegistro = (req, res) => {
  const { id } = req.params;
  const { horas } = req.body;

  const sql = `
    UPDATE registros
    SET horas = ?
    WHERE id = ?
  `;

  db.query(sql, [horas, id], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json(err);
    }

    res.json({
      message: "Actualizado ✅",
      data: { id, horas }
    });
  });
};

//  ELIMINAR REGISTRO
export const eliminarRegistro = (req, res) => {
  const { id } = req.params;
  const usuario_id = req.user.id;

  const sqlCheck = `
    SELECT * FROM registros
    WHERE id = ? AND usuario_id = ?
  `;

  db.query(sqlCheck, [id, usuario_id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json(err);
    }

    if (results.length === 0) {
      return res.status(403).json({
        message: "No tienes permiso para eliminar este registro"
      });
    }

    const sqlDelete = `DELETE FROM registros WHERE id = ?`;

    db.query(sqlDelete, [id], (err2) => {
      if (err2) {
        console.error(err2);
        return res.status(500).json(err2);
      }

      res.json({ message: "Eliminado ✅" });
    });
  });
};

// OBTENER RESUMEN TRABAJADORES
export const obtenerResumenTrabajadores = (req, res) => {
  const sql = `
    SELECT u.id, u.nombre, SUM(r.horas) as total_horas
    FROM usuarios u
    LEFT JOIN registros r ON u.id = r.usuario_id
    GROUP BY u.id, u.nombre
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json(err);
    }

    res.json(results);
  });
};
// BUSCAR CASAS
export const buscarCasas = (req, res) => {
  const q = req.query.q || ""; // 🔥 evita undefined

  const sql = `
    SELECT * FROM casas
    WHERE nombre LIKE ?
    LIMIT 10
  `;

  db.query(sql, [`%${q}%`], (err, results) => {
    if (err) {
      console.error("ERROR BUSCAR CASAS:", err);
      return res.status(500).json({ error: err.message });
    }

    res.json(results);
  });
};
// OBTENER REGISTROS POR USUARIO
export const obtenerRegistrosPorUsuario = (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT r.id, r.fecha, r.horas, r.casa_id, c.nombre as casa_nombre
    FROM registros r
    LEFT JOIN casas c ON r.casa_id = c.id
    WHERE r.usuario_id = ?
    ORDER BY r.fecha DESC
  `;

  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error("ERROR SQL:", err); // 🔥 IMPORTANTE
      return res.status(500).json({ error: err.message });
    }

    res.json(results);
  });
};