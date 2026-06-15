import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sidebar } from "@/components/Sidebar";
import { mockPagos, mockSolicitudes, mockNotificaciones } from "@/data/mockData";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Home, CreditCard, ClipboardList, Bell, Settings,
  Building2, CheckCircle2, AlertTriangle, Send, UserCircle, Phone, Mail, KeyRound
} from "lucide-react";
import { Switch } from "@/components/ui/switch";

const SIDEBAR_ITEMS = [
  { title: "Resumen", href: "/owner", icon: Home },
  { title: "Mis Pagos", href: "/owner/pagos", icon: CreditCard },
  { title: "Solicitudes", href: "/owner/solicitudes", icon: ClipboardList },
  { title: "Notificaciones", href: "/owner/notificaciones", icon: Bell },
  { title: "Configuración", href: "/owner/configuracion", icon: Settings },
];

// ─── RESUMEN ─────────────────────────────────────────────────────────────────
function ResumenSection({ user }: { user: { nombre: string } }) {
  const [payMethod, setPayMethod] = useState("transfer");

  const handlePay = () => toast.success("Pago realizado con éxito");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Hola, {user.nombre}</h2>
        <p className="text-muted-foreground text-sm mt-1">Resumen de tu cuenta y departamento</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card className="md:col-span-2">
          <CardHeader><CardTitle>Mi Departamento</CardTitle></CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Unidad</p>
                <p className="text-2xl font-bold">Depto 5B</p>
                <p className="text-sm text-muted-foreground mt-1">Piso 5</p>
              </div>
              <div className="hidden sm:block w-px bg-border" />
              <div>
                <p className="text-sm text-muted-foreground">Cuota mensual</p>
                <p className="text-2xl font-bold">UF 3.2</p>
                <p className="text-sm text-muted-foreground mt-1">≈ $120.800 CLP</p>
              </div>
              <div className="hidden sm:block w-px bg-border" />
              <div>
                <p className="text-sm text-muted-foreground">Saldo actual</p>
                <p className="text-2xl font-bold text-emerald-600">$0</p>
                <p className="text-sm text-muted-foreground mt-1">Al día</p>
              </div>
              <div className="hidden sm:block w-px bg-border" />
              <div>
                <p className="text-sm text-muted-foreground">Vencimiento</p>
                <p className="text-2xl font-bold text-amber-600">10 Ene</p>
                <p className="text-sm text-muted-foreground mt-1">Gastos enero</p>
              </div>
            </div>
            <div className="mt-6">
              <Dialog>
                <DialogTrigger asChild>
                  <Button data-testid="btn-pay-trigger">Realizar Pago</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>Pagar Gastos Comunes</DialogTitle></DialogHeader>
                  <div className="py-4">
                    <Label>Método de pago</Label>
                    <Select value={payMethod} onValueChange={setPayMethod}>
                      <SelectTrigger className="mt-2"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="transfer">Transferencia Bancaria</SelectItem>
                        <SelectItem value="card">Débito / Crédito</SelectItem>
                      </SelectContent>
                    </Select>
                    {payMethod === 'transfer' ? (
                      <div className="mt-4 p-4 bg-muted rounded-lg text-sm space-y-2">
                        <p><strong>Banco:</strong> Banco de Chile</p>
                        <p><strong>Cuenta:</strong> Corriente N° 123456789</p>
                        <p><strong>RUT:</strong> 76.543.210-K</p>
                        <p><strong>Correo:</strong> pagos@mirador.cl</p>
                      </div>
                    ) : (
                      <div className="mt-4 space-y-4">
                        <div className="space-y-2">
                          <Label>Número de Tarjeta</Label>
                          <Input placeholder="0000 0000 0000 0000" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2"><Label>Vencimiento</Label><Input placeholder="MM/YY" /></div>
                          <div className="space-y-2"><Label>CVV</Label><Input placeholder="123" /></div>
                        </div>
                      </div>
                    )}
                  </div>
                  <DialogFooter>
                    <Button onClick={handlePay} data-testid="btn-confirm-pay">Confirmar Pago</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Valor UF</CardTitle></CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">$37.750</p>
            <p className="text-sm text-muted-foreground mt-2">Actualizado: hoy 08:00 hrs</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Últimos Pagos</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockPagos.slice(0, 3).map(pago => (
                <div key={pago.id} className="flex justify-between items-center border-b pb-3 last:border-0 last:pb-0">
                  <div>
                    <p className="font-medium text-sm">{pago.concepto}</p>
                    <p className="text-xs text-muted-foreground">{pago.fecha || 'Sin fecha'}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm">${pago.monto.toLocaleString('es-CL')}</p>
                    <Badge variant="outline" className="text-xs">{pago.estado}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Notificaciones Recientes</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockNotificaciones.slice(0, 2).map(notif => (
                <div key={notif.id} className="p-3 bg-muted/50 rounded-lg">
                  <p className="font-medium text-sm">{notif.titulo}</p>
                  <p className="text-xs text-muted-foreground mt-1">{notif.fecha}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ─── MIS PAGOS ───────────────────────────────────────────────────────────────
function PagosSection() {
  const [payMethod, setPayMethod] = useState("transfer");
  const handlePay = () => toast.success("Pago realizado con éxito");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Mis Pagos</h2>
        <p className="text-muted-foreground text-sm mt-1">Historial de pagos y pago de gastos comunes</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Saldo actual</p>
            <p className="text-2xl font-bold text-emerald-600">Al día</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <CreditCard className="h-8 w-8 text-primary mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Cuota mensual</p>
            <p className="text-2xl font-bold">UF 3.2</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <AlertTriangle className="h-8 w-8 text-amber-500 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Próximo vencimiento</p>
            <p className="text-2xl font-bold text-amber-600">10 Ene</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Historial de Pagos</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockPagos.map(pago => (
                <div key={pago.id} className="flex justify-between items-center border-b pb-4 last:border-0 last:pb-0">
                  <div>
                    <p className="font-medium">{pago.concepto}</p>
                    <p className="text-sm text-muted-foreground">{pago.fecha || 'Pendiente'}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">${pago.monto.toLocaleString('es-CL')}</p>
                    <Badge variant={pago.estado === 'Pagado' ? 'default' : pago.estado === 'Atrasado' ? 'destructive' : 'secondary'}
                      className={pago.estado === 'Pagado' ? 'bg-emerald-500' : ''}>
                      {pago.estado}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Realizar Pago</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <p className="text-sm font-medium">Gastos Comunes — Enero 2025</p>
              <p className="text-2xl font-bold mt-1">$120.800 CLP</p>
              <p className="text-xs text-muted-foreground">Vence el 10 de enero</p>
            </div>
            <div className="space-y-2">
              <Label>Método de pago</Label>
              <Select value={payMethod} onValueChange={setPayMethod}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="transfer">Transferencia Bancaria</SelectItem>
                  <SelectItem value="card">Débito / Crédito</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {payMethod === 'transfer' ? (
              <div className="p-4 bg-muted rounded-lg text-sm space-y-1.5">
                <p><strong>Banco:</strong> Banco de Chile</p>
                <p><strong>Cuenta Corriente:</strong> 123456789</p>
                <p><strong>RUT:</strong> 76.543.210-K</p>
                <p><strong>Correo:</strong> pagos@mirador.cl</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="space-y-2"><Label>N° de Tarjeta</Label><Input placeholder="0000 0000 0000 0000" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2"><Label>Vencimiento</Label><Input placeholder="MM/YY" /></div>
                  <div className="space-y-2"><Label>CVV</Label><Input placeholder="123" /></div>
                </div>
              </div>
            )}
            <Button className="w-full" onClick={handlePay} data-testid="btn-confirm-pay">
              Confirmar Pago de $120.800
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ─── SOLICITUDES ─────────────────────────────────────────────────────────────
function SolicitudesSection() {
  const [tipo, setTipo] = useState("mantencion");
  const [descripcion, setDescripcion] = useState("");
  const misolicitudes = mockSolicitudes.filter(s => s.depto === '5B');

  const handleEnviar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!descripcion) { toast.error("Describe el problema"); return; }
    toast.success("Solicitud enviada al administrador");
    setDescripcion("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Solicitudes</h2>
        <p className="text-muted-foreground text-sm mt-1">Envío y seguimiento de solicitudes al administrador</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Nueva Solicitud</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleEnviar} className="space-y-4">
              <div className="space-y-2">
                <Label>Tipo</Label>
                <Select value={tipo} onValueChange={setTipo}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mantencion">Mantención</SelectItem>
                    <SelectItem value="ruido">Reclamo por ruido</SelectItem>
                    <SelectItem value="limpieza">Limpieza áreas comunes</SelectItem>
                    <SelectItem value="otros">Otros</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Descripción</Label>
                <textarea
                  className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                  placeholder="Describe el problema o solicitud..."
                  value={descripcion}
                  onChange={e => setDescripcion(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Prioridad</Label>
                <Select defaultValue="media">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="alta">Alta — urgente</SelectItem>
                    <SelectItem value="media">Media</SelectItem>
                    <SelectItem value="baja">Baja</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full gap-2">
                <Send className="h-4 w-4" />
                Enviar Solicitud
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Mis Solicitudes</CardTitle></CardHeader>
          <CardContent>
            {misolicitudes.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-8">No tienes solicitudes registradas.</p>
            ) : (
              <div className="space-y-4">
                {misolicitudes.map(sol => (
                  <div key={sol.id} className="border-b pb-4 last:border-0 last:pb-0">
                    <div className="flex justify-between items-start mb-1">
                      <p className="font-medium">{sol.tipo}</p>
                      <Badge variant={sol.estado === 'Listo' ? 'default' : sol.estado === 'Pendiente' ? 'secondary' : 'outline'}
                        className={sol.estado === 'Listo' ? 'bg-emerald-500' : ''}>
                        {sol.estado}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{sol.descripcion}</p>
                    <p className="text-xs text-muted-foreground mt-1">{sol.fecha}</p>
                  </div>
                ))}
                {mockSolicitudes.filter(s => s.residente === 'María González').map(sol => (
                  <div key={`g-${sol.id}`} className="border-b pb-4 last:border-0 last:pb-0">
                    <div className="flex justify-between items-start mb-1">
                      <p className="font-medium">{sol.tipo}</p>
                      <Badge variant="outline">{sol.estado}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{sol.descripcion}</p>
                    <p className="text-xs text-muted-foreground mt-1">{sol.fecha}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
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
        <p className="text-muted-foreground text-sm mt-1">Comunicados del administrador del edificio</p>
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

// ─── CONFIGURACIÓN ───────────────────────────────────────────────────────────
function ConfiguracionSection({ user }: { user: { nombre: string; email: string } }) {
  const [notifCorreo, setNotifCorreo] = useState(true);
  const [notifWA, setNotifWA] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Configuración</h2>
        <p className="text-muted-foreground text-sm mt-1">Datos de perfil y preferencias de notificación</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCircle className="h-5 w-5" />
              Datos de Perfil
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label>Nombre completo</Label>
              <Input defaultValue={user.nombre} />
            </div>
            <div className="grid gap-2">
              <Label>Correo electrónico</Label>
              <Input defaultValue={user.email ?? 'propietario@mirador.cl'} type="email" />
            </div>
            <div className="grid gap-2">
              <Label>Teléfono</Label>
              <Input defaultValue="+56 9 8765 4321" />
            </div>
            <div className="grid gap-2">
              <Label>RUT</Label>
              <Input defaultValue="12.345.678-9" disabled />
            </div>
            <Button className="w-full" onClick={() => toast.success("Perfil actualizado")}>
              Guardar cambios
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Preferencias de Notificación</CardTitle>
              <CardDescription>Cómo deseas recibir comunicados del edificio</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <Label>Correo electrónico</Label>
                </div>
                <Switch checked={notifCorreo} onCheckedChange={setNotifCorreo} />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <Label>WhatsApp</Label>
                </div>
                <Switch checked={notifWA} onCheckedChange={setNotifWA} />
              </div>
              <Button variant="outline" className="w-full" onClick={() => toast.success("Preferencias guardadas")}>
                Guardar preferencias
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <KeyRound className="h-5 w-5" />
                Cambiar Contraseña
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label>Contraseña actual</Label>
                <Input type="password" placeholder="••••••••" />
              </div>
              <div className="grid gap-2">
                <Label>Nueva contraseña</Label>
                <Input type="password" placeholder="••••••••" />
              </div>
              <div className="grid gap-2">
                <Label>Confirmar nueva contraseña</Label>
                <Input type="password" placeholder="••••••••" />
              </div>
              <Button variant="outline" className="w-full" onClick={() => toast.success("Contraseña actualizada")}>
                Actualizar contraseña
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ─── DASHBOARD PRINCIPAL ─────────────────────────────────────────────────────
export default function OwnerDashboard() {
  const { user, logout } = useAuth();
  const [location, setLocation] = useLocation();

  useEffect(() => {
    if (!user || user.role !== 'owner') {
      setLocation("/login");
    }
  }, [user, setLocation]);

  if (!user || user.role !== 'owner') return null;

  const seccion = location.split('/')[2] ?? '';

  const renderSeccion = () => {
    switch (seccion) {
      case 'pagos':          return <PagosSection />;
      case 'solicitudes':    return <SolicitudesSection />;
      case 'notificaciones': return <NotificacionesSection />;
      case 'configuracion':  return <ConfiguracionSection user={user} />;
      default:               return <ResumenSection user={user} />;
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 flex">
      <Sidebar items={SIDEBAR_ITEMS} />

      <main className="flex-1 md:ml-64 p-6 pt-20 md:pt-6">
        <div className="flex items-center gap-3 mb-6">
          <Building2 className="h-5 w-5 text-primary" />
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border border-green-200 font-medium">
            Propietario — {user.nombre}
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
