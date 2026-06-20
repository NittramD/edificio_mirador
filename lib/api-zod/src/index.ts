import { z } from "zod";

// ─── Health ──────────────────────────────────────────────────────

export const HealthCheckResponse = z.object({
  status: z.literal("ok"),
});
export type HealthCheckResponse = z.infer<typeof HealthCheckResponse>;

// ─── Usuarios (RF-04) ────────────────────────────────────────────

export const RolNombre = z.enum([
  "Administrador",
  "Propietario",
  "Arrendatario",
  "Mantención",
]);
export type RolNombre = z.infer<typeof RolNombre>;

export const EstadoUsuario = z.enum(["Activo", "Inactivo"]);
export type EstadoUsuario = z.infer<typeof EstadoUsuario>;

export const Usuario = z.object({
  id: z.number(),
  nombre: z.string().min(1),
  email: z.string().email(),
  rut: z.string().min(1),
  rol: z.string(),
  depto: z.string(),
  piso: z.number(),
  estado: EstadoUsuario,
  medioPreferido: z.string(),
  creadoEn: z.string(),
});
export type Usuario = z.infer<typeof Usuario>;

export const CrearUsuarioInput = Usuario.pick({
  nombre: true,
  email: true,
  rut: true,
  rol: true,
}).extend({
  depto: z.string().optional(),
  piso: z.number().optional(),
  medioPreferido: z.string().optional(),
});
export type CrearUsuarioInput = z.infer<typeof CrearUsuarioInput>;

export const ActualizarUsuarioInput = Usuario.partial().omit({ id: true });
export type ActualizarUsuarioInput = z.infer<typeof ActualizarUsuarioInput>;

// ─── Roles (RF-05) ───────────────────────────────────────────────

export const Rol = z.object({
  id: z.number(),
  nombre: z.string().min(1),
  descripcion: z.string(),
  permisos: z.array(z.string()),
  creadoEn: z.string(),
});
export type Rol = z.infer<typeof Rol>;

export const CrearRolInput = Rol.pick({
  nombre: true,
  descripcion: true,
  permisos: true,
});
export type CrearRolInput = z.infer<typeof CrearRolInput>;
