// CRUD completo para Usuarios – RF-04
import { Router, type IRouter, type Request, type Response } from "express";

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rut: string;
  rol: string;
  depto: string;
  piso: number;
  estado: string;
  medioPreferido: string;
  creadoEn: string;
}

export interface Rol {
  id: number;
  nombre: string;
  descripcion: string;
  permisos: string[];
  creadoEn: string;
}

// Datos en memoria (mock)
let usuarios: Usuario[] = [
  { id: 1, nombre: "Carlos Mendoza", email: "carlos.m@gmail.com", rut: "12.345.678-9", rol: "Propietario", depto: "3A", piso: 3, estado: "Activo", medioPreferido: "Correo", creadoEn: "2022-03-01" },
  { id: 2, nombre: "María González", email: "maria.g@gmail.com", rut: "13.456.789-0", rol: "Arrendatario", depto: "5B", piso: 5, estado: "Activo", medioPreferido: "WhatsApp", creadoEn: "2023-06-01" },
  { id: 3, nombre: "Roberto Silva", email: "roberto.s@gmail.com", rut: "14.567.890-1", rol: "Propietario", depto: "2C", piso: 2, estado: "Activo", medioPreferido: "Correo", creadoEn: "2021-01-15" },
  { id: 4, nombre: "Ana Pérez", email: "ana.p@gmail.com", rut: "15.678.901-2", rol: "Arrendatario", depto: "7A", piso: 7, estado: "Activo", medioPreferido: "SMS", creadoEn: "2024-09-01" },
  { id: 5, nombre: "Jorge Fuentes", email: "jorge.f@gmail.com", rut: "16.789.012-3", rol: "Propietario", depto: "1B", piso: 1, estado: "Activo", medioPreferido: "Correo", creadoEn: "2020-05-10" },
  { id: 6, nombre: "Valentina Castro", email: "vale.c@gmail.com", rut: "17.890.123-4", rol: "Arrendatario", depto: "6C", piso: 6, estado: "Activo", medioPreferido: "WhatsApp", creadoEn: "2023-11-20" },
  { id: 7, nombre: "Diego Rojas", email: "diego.r@gmail.com", rut: "18.901.234-5", rol: "Propietario", depto: "4A", piso: 4, estado: "Inactivo", medioPreferido: "Correo", creadoEn: "2019-08-12" },
  { id: 8, nombre: "Francisca Morales", email: "fran.m@gmail.com", rut: "19.012.345-6", rol: "Arrendatario", depto: "8B", piso: 8, estado: "Activo", medioPreferido: "SMS", creadoEn: "2024-01-05" },
  { id: 9, nombre: "Andrés Vega", email: "andres.v@gmail.com", rut: "20.123.456-7", rol: "Propietario", depto: "2A", piso: 2, estado: "Activo", medioPreferido: "Correo", creadoEn: "2022-07-18" },
  { id: 10, nombre: "Sofía Herrera", email: "sofia.h@gmail.com", rut: "21.234.567-8", rol: "Arrendatario", depto: "5C", piso: 5, estado: "Activo", medioPreferido: "WhatsApp", creadoEn: "2024-03-22" },
];

let roles: Rol[] = [
  { id: 1, nombre: "Administrador", descripcion: "Acceso completo al sistema", permisos: ["usuarios.crear", "usuarios.editar", "usuarios.eliminar", "pagos.ver", "pagos.crear", "reportes.ver", "solicitudes.gestionar", "notificaciones.enviar"], creadoEn: "2020-01-01" },
  { id: 2, nombre: "Propietario", descripcion: "Propietario de departamento", permisos: ["pagos.ver", "pagos.crear", "solicitudes.crear", "solicitudes.ver_propios", "notificaciones.ver"], creadoEn: "2020-01-01" },
  { id: 3, nombre: "Arrendatario", descripcion: "Arrendatario de departamento", permisos: ["pagos.ver", "pagos.crear", "solicitudes.crear", "solicitudes.ver_propios", "notificaciones.ver"], creadoEn: "2020-01-01" },
  { id: 4, nombre: "Mantención", descripcion: "Personal técnico de mantención", permisos: ["solicitudes.ver", "solicitudes.actualizar_estado", "actividad.ver"], creadoEn: "2020-01-01" },
];

let nextUserId = 11;
let nextRolId = 5;

const router: IRouter = Router();

// ─── USUARIOS ──────────────────────────────────────────────────

// GET /api/usuarios – listar todos
router.get("/usuarios", (_req: Request, res: Response) => {
  res.json({ data: usuarios, total: usuarios.length });
});

// GET /api/usuarios/:id – obtener uno
router.get("/usuarios/:id", (req: Request, res: Response) => {
  const id = parseInt(req.params["id"] ?? "0");
  const usuario = usuarios.find(u => u.id === id);
  if (!usuario) {
    res.status(404).json({ error: "Usuario no encontrado" });
    return;
  }
  res.json({ data: usuario });
});

// POST /api/usuarios – crear usuario
router.post("/usuarios", (req: Request, res: Response) => {
  const { nombre, email, rut, rol, depto, piso, medioPreferido } = req.body as Partial<Usuario>;

  if (!nombre || !email || !rut || !rol) {
    res.status(400).json({ error: "Los campos nombre, email, RUT y rol son obligatorios" });
    return;
  }

  const rutExiste = usuarios.find(u => u.rut === rut);
  if (rutExiste) {
    res.status(409).json({ error: `El RUT ${rut} ya está registrado en el sistema` });
    return;
  }

  const emailExiste = usuarios.find(u => u.email === email);
  if (emailExiste) {
    res.status(409).json({ error: `El correo ${email} ya está registrado en el sistema` });
    return;
  }

  const nuevo: Usuario = {
    id: nextUserId++,
    nombre,
    email,
    rut,
    rol,
    depto: depto ?? "",
    piso: piso ?? 0,
    estado: "Activo",
    medioPreferido: medioPreferido ?? "Correo",
    creadoEn: new Date().toISOString().split("T")[0] ?? "",
  };

  usuarios.push(nuevo);
  res.status(201).json({ data: nuevo, mensaje: `Residente ${nuevo.nombre} registrado exitosamente` });
});

// PUT /api/usuarios/:id – actualizar usuario
router.put("/usuarios/:id", (req: Request, res: Response) => {
  const id = parseInt(req.params["id"] ?? "0");
  const idx = usuarios.findIndex(u => u.id === id);
  if (idx === -1) {
    res.status(404).json({ error: "Usuario no encontrado" });
    return;
  }

  const updates = req.body as Partial<Usuario>;

  // Verificar RUT duplicado (si se cambia)
  if (updates.rut && updates.rut !== usuarios[idx]!.rut) {
    const rutExiste = usuarios.find(u => u.rut === updates.rut && u.id !== id);
    if (rutExiste) {
      res.status(409).json({ error: `El RUT ${updates.rut} ya está registrado en el sistema` });
      return;
    }
  }

  usuarios[idx] = { ...usuarios[idx]!, ...updates, id };
  res.json({ data: usuarios[idx], mensaje: "Usuario actualizado correctamente" });
});

// PATCH /api/usuarios/:id/estado – cambiar estado activo/inactivo
router.patch("/usuarios/:id/estado", (req: Request, res: Response) => {
  const id = parseInt(req.params["id"] ?? "0");
  const idx = usuarios.findIndex(u => u.id === id);
  if (idx === -1) {
    res.status(404).json({ error: "Usuario no encontrado" });
    return;
  }

  const nuevoEstado = usuarios[idx]!.estado === "Activo" ? "Inactivo" : "Activo";
  usuarios[idx]!.estado = nuevoEstado;

  res.json({
    data: usuarios[idx],
    mensaje: `Usuario ${usuarios[idx]!.nombre} ${nuevoEstado === "Activo" ? "activado" : "desactivado"} correctamente`
  });
});

// DELETE /api/usuarios/:id – eliminar usuario
router.delete("/usuarios/:id", (req: Request, res: Response) => {
  const id = parseInt(req.params["id"] ?? "0");
  const idx = usuarios.findIndex(u => u.id === id);
  if (idx === -1) {
    res.status(404).json({ error: "Usuario no encontrado" });
    return;
  }

  const eliminado = usuarios[idx]!;
  usuarios.splice(idx, 1);
  res.json({ mensaje: `Usuario ${eliminado.nombre} eliminado del sistema` });
});

// ─── ROLES ──────────────────────────────────────────────────────

// GET /api/roles – listar todos los roles
router.get("/roles", (_req: Request, res: Response) => {
  res.json({ data: roles, total: roles.length });
});

// GET /api/roles/:id – obtener un rol
router.get("/roles/:id", (req: Request, res: Response) => {
  const id = parseInt(req.params["id"] ?? "0");
  const rol = roles.find(r => r.id === id);
  if (!rol) {
    res.status(404).json({ error: "Rol no encontrado" });
    return;
  }
  res.json({ data: rol });
});

// POST /api/roles – crear rol
router.post("/roles", (req: Request, res: Response) => {
  const { nombre, descripcion, permisos } = req.body as Partial<Rol>;

  if (!nombre) {
    res.status(400).json({ error: "El nombre del rol es obligatorio" });
    return;
  }

  const nombreExiste = roles.find(r => r.nombre.toLowerCase() === nombre.toLowerCase());
  if (nombreExiste) {
    res.status(409).json({ error: `El rol "${nombre}" ya existe en el sistema` });
    return;
  }

  const nuevo: Rol = {
    id: nextRolId++,
    nombre,
    descripcion: descripcion ?? "",
    permisos: permisos ?? [],
    creadoEn: new Date().toISOString().split("T")[0] ?? "",
  };

  roles.push(nuevo);
  res.status(201).json({ data: nuevo, mensaje: `Rol "${nuevo.nombre}" creado exitosamente` });
});

// PUT /api/roles/:id – actualizar rol
router.put("/roles/:id", (req: Request, res: Response) => {
  const id = parseInt(req.params["id"] ?? "0");
  const idx = roles.findIndex(r => r.id === id);
  if (idx === -1) {
    res.status(404).json({ error: "Rol no encontrado" });
    return;
  }

  const updates = req.body as Partial<Rol>;
  roles[idx] = { ...roles[idx]!, ...updates, id };
  res.json({ data: roles[idx], mensaje: `Rol "${roles[idx]!.nombre}" actualizado correctamente` });
});

// DELETE /api/roles/:id – eliminar rol
router.delete("/roles/:id", (req: Request, res: Response) => {
  const id = parseInt(req.params["id"] ?? "0");
  const rolesProtegidos = [1, 2, 3, 4]; // No se pueden eliminar los roles base
  if (rolesProtegidos.includes(id)) {
    res.status(403).json({ error: "No se pueden eliminar los roles base del sistema" });
    return;
  }

  const idx = roles.findIndex(r => r.id === id);
  if (idx === -1) {
    res.status(404).json({ error: "Rol no encontrado" });
    return;
  }

  const eliminado = roles[idx]!;
  roles.splice(idx, 1);
  res.json({ mensaje: `Rol "${eliminado.nombre}" eliminado del sistema` });
});

export default router;
