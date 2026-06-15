export const mockResidentes = [
  { id: 1, nombre: 'Carlos Mendoza', email: 'carlos.m@gmail.com', rut: '12.345.678-9', rol: 'Propietario', depto: '3A', piso: 3, estado: 'Activo', medioPreferido: 'Correo' },
  { id: 2, nombre: 'María González', email: 'maria.g@gmail.com', rut: '13.456.789-0', rol: 'Arrendatario', depto: '5B', piso: 5, estado: 'Activo', medioPreferido: 'WhatsApp' },
  { id: 3, nombre: 'Roberto Silva', email: 'roberto.s@gmail.com', rut: '14.567.890-1', rol: 'Propietario', depto: '2C', piso: 2, estado: 'Activo', medioPreferido: 'Correo' },
  { id: 4, nombre: 'Ana Pérez', email: 'ana.p@gmail.com', rut: '15.678.901-2', rol: 'Arrendatario', depto: '7A', piso: 7, estado: 'Activo', medioPreferido: 'SMS' },
  { id: 5, nombre: 'Jorge Fuentes', email: 'jorge.f@gmail.com', rut: '16.789.012-3', rol: 'Propietario', depto: '1B', piso: 1, estado: 'Activo', medioPreferido: 'Correo' },
  { id: 6, nombre: 'Valentina Castro', email: 'vale.c@gmail.com', rut: '17.890.123-4', rol: 'Arrendatario', depto: '6C', piso: 6, estado: 'Activo', medioPreferido: 'WhatsApp' },
  { id: 7, nombre: 'Diego Rojas', email: 'diego.r@gmail.com', rut: '18.901.234-5', rol: 'Propietario', depto: '4A', piso: 4, estado: 'Inactivo', medioPreferido: 'Correo' },
  { id: 8, nombre: 'Francisca Morales', email: 'fran.m@gmail.com', rut: '19.012.345-6', rol: 'Arrendatario', depto: '8B', piso: 8, estado: 'Activo', medioPreferido: 'SMS' },
  { id: 9, nombre: 'Andrés Vega', email: 'andres.v@gmail.com', rut: '20.123.456-7', rol: 'Propietario', depto: '2A', piso: 2, estado: 'Activo', medioPreferido: 'Correo' },
  { id: 10, nombre: 'Sofía Herrera', email: 'sofia.h@gmail.com', rut: '21.234.567-8', rol: 'Arrendatario', depto: '5C', piso: 5, estado: 'Activo', medioPreferido: 'WhatsApp' },
];

export const mockPagos = [
  { id: 1, residente: 'Carlos Mendoza', depto: '3A', monto: 98500, fecha: '05/01/2025', estado: 'Pagado', concepto: 'Gastos Comunes Enero' },
  { id: 2, residente: 'María González', depto: '5B', monto: 120800, fecha: '03/01/2025', estado: 'Pagado', concepto: 'Gastos Comunes Enero' },
  { id: 3, residente: 'Roberto Silva', depto: '2C', monto: 89000, fecha: '', estado: 'Pendiente', concepto: 'Gastos Comunes Enero' },
  { id: 4, residente: 'Ana Pérez', depto: '7A', monto: 115000, fecha: '', estado: 'Atrasado', concepto: 'Gastos Comunes Diciembre' },
  { id: 5, residente: 'Jorge Fuentes', depto: '1B', monto: 76500, fecha: '07/01/2025', estado: 'Pagado', concepto: 'Gastos Comunes Enero' },
  { id: 6, residente: 'Valentina Castro', depto: '6C', monto: 132000, fecha: '', estado: 'Pendiente', concepto: 'Gastos Comunes Enero' },
  { id: 7, residente: 'Diego Rojas', depto: '4A', monto: 105000, fecha: '', estado: 'Atrasado', concepto: 'Gastos Comunes Noviembre' },
  { id: 8, residente: 'Francisca Morales', depto: '8B', monto: 145000, fecha: '06/01/2025', estado: 'Pagado', concepto: 'Gastos Comunes Enero' },
];

export const mockSolicitudes = [
  { id: 1, depto: '5B', residente: 'María González', tipo: 'Filtración', descripcion: 'Gotera en el techo del baño', prioridad: 'Alta', estado: 'Pendiente', fecha: '08/01/2025' },
  { id: 2, depto: '3A', residente: 'Carlos Mendoza', tipo: 'Luminaria', descripcion: 'Foco quemado en pasillo piso 3', prioridad: 'Media', estado: 'En Proceso', fecha: '06/01/2025' },
  { id: 3, depto: '7A', residente: 'Ana Pérez', tipo: 'Ruido', descripcion: 'Ruido excesivo depto 7B después de las 23:00', prioridad: 'Media', estado: 'Pendiente', fecha: '07/01/2025' },
  { id: 4, depto: '2C', residente: 'Roberto Silva', tipo: 'Ascensor', descripcion: 'Ascensor hace ruido extraño', prioridad: 'Alta', estado: 'En Proceso', fecha: '05/01/2025' },
  { id: 5, depto: '6C', residente: 'Valentina Castro', tipo: 'Limpieza', descripcion: 'Basura acumulada en subterráneo', prioridad: 'Baja', estado: 'Listo', fecha: '04/01/2025' },
];

export const mockNotificaciones = [
  { id: 1, titulo: 'Asamblea de Copropietarios', mensaje: 'Se convoca a asamblea ordinaria el 15 de enero a las 19:00 hrs en salón de eventos.', fecha: '08/01/2025', tipo: 'info' },
  { id: 2, titulo: 'Corte de Agua Programado', mensaje: 'El día 12 de enero entre 9:00 y 13:00 hrs no habrá suministro de agua por mantención.', fecha: '07/01/2025', tipo: 'warning' },
  { id: 3, titulo: 'Pago de Gastos Comunes', mensaje: 'Recordatorio: El plazo para pagar gastos comunes de enero vence el 10 de enero.', fecha: '06/01/2025', tipo: 'info' },
  { id: 4, titulo: 'Ascensor en Mantención', mensaje: 'El ascensor estará fuera de servicio el 11 de enero entre 8:00 y 12:00 hrs.', fecha: '05/01/2025', tipo: 'warning' },
];

// RF-05: Vínculos personas-propiedad
export const mockVinculos = [
  {
    id: 1,
    depto: '3A',
    residenteId: 1,
    residente: 'Carlos Mendoza',
    rolVinculo: 'Propietario',
    vigenciaInicio: '01/03/2022',
    vigenciaFin: '',
    prioridad: 1,
    responsabilidad: 'Pago de GC',
  },
  {
    id: 2,
    depto: '5B',
    residenteId: 2,
    residente: 'María González',
    rolVinculo: 'Arrendatario',
    vigenciaInicio: '01/06/2023',
    vigenciaFin: '31/05/2025',
    prioridad: 1,
    responsabilidad: 'Contacto emergencia',
  },
  {
    id: 3,
    depto: '2C',
    residenteId: 3,
    residente: 'Roberto Silva',
    rolVinculo: 'Propietario',
    vigenciaInicio: '15/01/2021',
    vigenciaFin: '',
    prioridad: 1,
    responsabilidad: 'Representante legal',
  },
  {
    id: 4,
    depto: '7A',
    residenteId: 4,
    residente: 'Ana Pérez',
    rolVinculo: 'Arrendatario',
    vigenciaInicio: '01/09/2024',
    vigenciaFin: '31/08/2025',
    prioridad: 1,
    responsabilidad: 'Pago de GC',
  },
];

export const mockDepartamentos = [
  { id: 1, numero: '1A', piso: 1, superficie: 52, tipo: '2D+2B', estado: 'Ocupado', propietario: 'Jorge Fuentes', arrendatario: null },
  { id: 2, numero: '1B', piso: 1, superficie: 68, tipo: '3D+2B', estado: 'Ocupado', propietario: 'Pedro Alvarado', arrendatario: null },
  { id: 3, numero: '2A', piso: 2, superficie: 52, tipo: '2D+2B', estado: 'Ocupado', propietario: 'Andrés Vega', arrendatario: null },
  { id: 4, numero: '2C', piso: 2, superficie: 72, tipo: '3D+2B', estado: 'Ocupado', propietario: 'Roberto Silva', arrendatario: null },
  { id: 5, numero: '3A', piso: 3, superficie: 58, tipo: '2D+2B', estado: 'Ocupado', propietario: 'Carlos Mendoza', arrendatario: 'Gonzalo Ruiz' },
  { id: 6, numero: '4A', piso: 4, superficie: 64, tipo: '3D+2B', estado: 'Disponible', propietario: 'Diego Rojas', arrendatario: null },
  { id: 7, numero: '4B', piso: 4, superficie: 52, tipo: '2D+2B', estado: 'Ocupado', propietario: 'Isabel Cárdenas', arrendatario: null },
  { id: 8, numero: '5B', piso: 5, superficie: 75, tipo: '3D+2B', estado: 'Ocupado', propietario: 'Héctor Paredes', arrendatario: 'María González' },
  { id: 9, numero: '5C', piso: 5, superficie: 60, tipo: '2D+2B', estado: 'Ocupado', propietario: 'Lorena Muñoz', arrendatario: 'Sofía Herrera' },
  { id: 10, numero: '6C', piso: 6, superficie: 80, tipo: '3D+3B', estado: 'Ocupado', propietario: 'Manuel Torres', arrendatario: 'Valentina Castro' },
  { id: 11, numero: '7A', piso: 7, superficie: 64, tipo: '3D+2B', estado: 'Ocupado', propietario: 'Cecilia Pino', arrendatario: 'Ana Pérez' },
  { id: 12, numero: '7B', piso: 7, superficie: 52, tipo: '2D+2B', estado: 'Disponible', propietario: 'Ricardo Soto', arrendatario: null },
  { id: 13, numero: '8B', piso: 8, superficie: 88, tipo: '4D+3B', estado: 'Ocupado', propietario: 'Gabriela León', arrendatario: 'Francisca Morales' },
  { id: 14, numero: '8C', piso: 8, superficie: 72, tipo: '3D+2B', estado: 'Disponible', propietario: 'Tomás Vargas', arrendatario: null },
];

export const mockLogActividad = [
  { id: 1, usuario: 'Admin', accion: 'Registró nuevo residente: Sofía Herrera (Depto 5C)', fecha: '08/01/2025 10:45' },
  { id: 2, usuario: 'Admin', accion: 'Envió recordatorio de pago a Ana Pérez (Depto 7A)', fecha: '08/01/2025 09:30' },
  { id: 3, usuario: 'Pedro Díaz', accion: 'Actualizó estado solicitud #4 (Ascensor) a En Proceso', fecha: '07/01/2025 16:20' },
  { id: 4, usuario: 'Admin', accion: 'Desactivó usuario: Diego Rojas (Depto 4A)', fecha: '07/01/2025 11:00' },
  { id: 5, usuario: 'Admin', accion: 'Descargó reporte mensual enero 2025', fecha: '06/01/2025 14:15' },
  { id: 6, usuario: 'Admin', accion: 'Envió recordatorio de pago a Diego Rojas (Depto 4A)', fecha: '05/01/2025 09:00' },
];
