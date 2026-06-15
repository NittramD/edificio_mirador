import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sidebar } from "@/components/Sidebar";
import { mockSolicitudes, mockLogActividad, mockNotificaciones } from "@/data/mockData";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Wrench, Activity, Bell, CheckCircle2, Clock, AlertTriangle
} from "lucide-react";

const SIDEBAR_ITEMS = [
  { title: "Mis Tareas", href: "/maintenance", icon: Wrench },
  { title: "Historial", href: "/maintenance/historial", icon: Activity },
  { title: "Notificaciones", href: "/maintenance/notificaciones", icon: Bell },
];

// ─── MIS TAREAS ──────────────────────────────────────────────────────────────
function TareasSection() {
  const [solicitudes, setSolicitudes] = useState(mockSolicitudes);

  const pendientes = solicitudes.filter(s => s.estado === 'Pendiente').length;
  const enProceso = solicitudes.filter(s => s.estado === 'En Proceso').length;
  const listas = solicitudes.filter(s => s.estado === 'Listo').length;

  const handleCambiarEstado = (id: number, nuevoEstado: string) => {
    setSolicitudes(prev => prev.map(s => s.id === id ? { ...s, estado: nuevoEstado } : s));
    toast.success(`Tarea actualizada a: ${nuevoEstado}`);
  };

  const getPrioridadVariant = (p: string): "destructive" | "default" | "secondary" => {
    if (p === 'Alta') return 'destructive';
    if (p === 'Media') return 'default';
    return 'secondary';
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Mis Tareas</h2>
        <p className="text-muted-foreground text-sm mt-1">Solicitudes asignadas y su estado actual</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <AlertTriangle className="h-8 w-8 text-amber-500 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Pendientes</p>
            <p className="text-3xl font-bold text-amber-600">{pendientes}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <Clock className="h-8 w-8 text-primary mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">En Proceso</p>
            <p className="text-3xl font-bold text-primary">{enProceso}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Completadas</p>
            <p className="text-3xl font-bold text-emerald-600">{listas}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Listado de Solicitudes</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-4">
            {solicitudes.map(sol => (
              <div key={sol.id} className="border p-4 rounded-lg bg-card shadow-sm flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-bold text-lg">Depto {sol.depto}</span>
                    <Badge variant={getPrioridadVariant(sol.prioridad)}>
                      Prioridad {sol.prioridad}
                    </Badge>
                  </div>
                  <p className="font-medium text-primary">{sol.tipo}</p>
                  <p className="text-sm text-muted-foreground mt-1">{sol.descripcion}</p>
                  <p className="text-xs text-muted-foreground mt-2">Reportado por: {sol.residente} • {sol.fecha}</p>
                </div>
                <div className="w-full md:w-auto">
                  <Select
                    defaultValue={sol.estado}
                    onValueChange={(val) => handleCambiarEstado(sol.id, val)}>
                    <SelectTrigger className="w-full md:w-40" data-testid={`select-status-${sol.id}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pendiente">Pendiente</SelectItem>
                      <SelectItem value="En Proceso">En Proceso</SelectItem>
                      <SelectItem value="Listo">Listo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── HISTORIAL ───────────────────────────────────────────────────────────────
function HistorialSection() {
  const logCompleto = [
    { id: 1, time: 'Hoy, 09:30', action: 'Revisión ascensor principal', status: 'En Proceso', tipo: 'Ascensor' },
    { id: 2, time: 'Hoy, 08:00', action: 'Limpieza subterráneo nivel -1', status: 'Listo', tipo: 'Limpieza' },
    { id: 3, time: 'Ayer, 16:45', action: 'Reposición foco pasillo piso 3', status: 'Listo', tipo: 'Luminaria' },
    { id: 4, time: 'Ayer, 11:20', action: 'Revisión bomba de agua', status: 'Listo', tipo: 'Mantención' },
    { id: 5, time: '06/01/2025', action: 'Limpieza área jardines', status: 'Listo', tipo: 'Limpieza' },
    { id: 6, time: '05/01/2025', action: 'Reparación portón entrada', status: 'Listo', tipo: 'Mantención' },
    ...mockLogActividad.map(l => ({ id: l.id + 10, time: l.fecha, action: l.accion, status: 'Listo', tipo: 'Sistema' })),
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Historial</h2>
        <p className="text-muted-foreground text-sm mt-1">Registro de trabajos realizados y actividad del equipo</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Tareas completadas este mes</p>
            <p className="text-3xl font-bold text-emerald-600">14</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <Clock className="h-8 w-8 text-primary mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Tiempo promedio de resolución</p>
            <p className="text-3xl font-bold text-primary">2.3 días</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Log de Actividad</CardTitle>
          <CardDescription>Historial completo de trabajos y acciones</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {logCompleto.slice(0, 8).map(log => (
              <div key={log.id} className="flex items-start gap-4 border-b pb-4 last:border-0 last:pb-0">
                <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-sm">{log.action}</p>
                    <Badge variant={log.status === 'En Proceso' ? 'default' : 'secondary'}
                      className={log.status === 'Listo' ? 'bg-emerald-100 text-emerald-800' : ''}>
                      {log.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">{log.tipo}</Badge>
                    <span className="text-xs text-muted-foreground">{log.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── NOTIFICACIONES ──────────────────────────────────────────────────────────
function NotificacionesSection() {
  const tipoColor = (t: string) =>
    t === 'warning'
      ? 'border-amber-200 bg-amber-50 dark:bg-amber-900/10'
      : 'border-blue-200 bg-blue-50 dark:bg-blue-900/10';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Notificaciones</h2>
        <p className="text-muted-foreground text-sm mt-1">Avisos del administrador y del sistema</p>
      </div>

      <div className="space-y-4">
        {mockNotificaciones.map(notif => (
          <Card key={notif.id} className={`border ${tipoColor(notif.tipo)}`}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="font-semibold mb-1">{notif.titulo}</p>
                  <p className="text-sm text-muted-foreground">{notif.mensaje}</p>
                  <p className="text-xs text-muted-foreground mt-3">{notif.fecha}</p>
                </div>
                <Badge variant={notif.tipo === 'warning' ? 'outline' : 'secondary'}>
                  {notif.tipo === 'warning' ? 'Aviso' : 'Info'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─── DASHBOARD PRINCIPAL ─────────────────────────────────────────────────────
export default function MaintenanceDashboard() {
  const { user, logout } = useAuth();
  const [location, setLocation] = useLocation();

  useEffect(() => {
    if (!user || user.role !== 'maintenance') {
      setLocation("/login");
    }
  }, [user, setLocation]);

  if (!user || user.role !== 'maintenance') return null;

  const seccion = location.split('/')[2] ?? '';

  const renderSeccion = () => {
    switch (seccion) {
      case 'historial':      return <HistorialSection />;
      case 'notificaciones': return <NotificacionesSection />;
      default:               return <TareasSection />;
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 flex">
      <Sidebar items={SIDEBAR_ITEMS} />

      <main className="flex-1 md:ml-64 p-6 pt-20 md:pt-6">
        <div className="flex items-center gap-3 mb-6">
          <Wrench className="h-5 w-5 text-primary" />
          <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 border border-purple-200 font-medium">
            Mantención — {user.nombre}
          </Badge>
          <Button variant="ghost" size="sm" onClick={logout} className="text-destructive gap-2 ml-auto hidden sm:flex">
            Cerrar sesión
          </Button>
        </div>

        {renderSeccion()}
      </main>
    </div>
  );
}
