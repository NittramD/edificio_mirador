import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";

export const roles = pgTable("roles", {
  id: serial("id").primaryKey(),
  nombre: text("nombre").notNull().unique(),
  descripcion: text("descripcion").notNull().default(""),
  permisos: jsonb("permisos").$type<string[]>().notNull().default([]),
  creadoEn: timestamp("creado_en").notNull().defaultNow(),
});

export const usuarios = pgTable("usuarios", {
  id: serial("id").primaryKey(),
  nombre: text("nombre").notNull(),
  email: text("email").notNull().unique(),
  rut: text("rut").notNull().unique(),
  rol: text("rol").notNull(),
  depto: text("depto").notNull().default(""),
  piso: integer("piso").notNull().default(0),
  estado: text("estado").notNull().default("Activo"),
  medioPreferido: text("medio_preferido").notNull().default("Correo"),
  creadoEn: timestamp("creado_en").notNull().defaultNow(),
});

// Asociación usuario-propiedad (multi-rol) — RF-06
export const usuarioPropiedadRol = pgTable("usuario_propiedad_rol", {
  id: serial("id").primaryKey(),
  usuarioId: integer("usuario_id")
    .notNull()
    .references(() => usuarios.id, { onDelete: "cascade" }),
  rolId: integer("rol_id")
    .notNull()
    .references(() => roles.id, { onDelete: "restrict" }),
  depto: text("depto").notNull(),
  piso: integer("piso").notNull(),
  estado: text("estado").notNull().default("Activo"),
  fechaInicio: timestamp("fecha_inicio").notNull().defaultNow(),
  fechaTermino: timestamp("fecha_termino"),
});
