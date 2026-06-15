import { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import {
  Home, Users, Building2, CreditCard, FileText,
  ClipboardList, Bell, Settings, Edit, Trash2, Download,
  UserPlus, Search, RefreshCw, AlertTriangle, Send,
  UserX, Link2, Clock, Activity, ShieldCheck, CheckCircle2,
  XCircle, Wrench, MailOpen, Phone, MessageSquare
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { mockResidentes, mockPagos, mockSolicitudes, mockVinculos, mockLogActividad, mockNotificaciones, mockDepartamentos } from "@/data/mockData";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

const SIDEBAR_ITEMS = [
  { title: "Resumen", href: "/admin", icon: Home },
  { title: "Residentes", href: "/admin/residentes", icon: Users },
  { title: "Departamentos", href: "/admin/departamentos", icon: Building2 },
  { title: "Pagos", href: "/admin/pagos", icon: CreditCard },
  { title: "Reportes", href: "/admin/reportes", icon: FileText },
  { title: "Solicitudes", href: "/admin/solicitudes", icon: ClipboardList },
  { title: "Notificaciones", href: "/admin/notificaciones", icon: Bell },
  { title: "Configuración", href: "/admin/configuracion", icon: Settings },
];

// ─── SECCIÓN RESIDENTES (RF-04) ─────────────────────────────────────────────
function ResidentesSection() {
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [residentes, setResidentes] = useState(mockResidentes);
  const [nuevoUsuarioOpen, setNuevoUsuarioOpen] = useState(false);
  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombre: '', email: '', rut: '', rol: 'Arrendatario', depto: '', medioPreferido: 'Correo'
  });

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const getRoleColor = (rol: string) => {
    switch (rol) {
      case 'Propietario': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800';
      case 'Arrendatario': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800';
      default: return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800';
    }
  };

  const residenetesFiltrados = residentes.filter(r =>
    r.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    r.rut.toLowerCase().includes(busqueda.toLowerCase()) ||
    r.depto.toLowerCase().includes(busqueda.toLowerCase()) ||
    r.email.toLowerCase().includes(busqueda.toLowerCase())
  );

  const handleRegistrar = () => {
    if (!nuevoUsuario.nombre || !nuevoUsuario.rut || !nuevoUsuario.email) {
      toast.error("Completa todos los campos obligatorios");
      return;
    }
    const nuevo = {
      id: residentes.length + 1,
      ...nuevoUsuario,
      piso: 1,
      estado: 'Activo'
    };
    setResidentes(prev => [...prev, nuevo]);
    setNuevoUsuarioOpen(false);
    setNuevoUsuario({ nombre: '', email: '', rut: '', rol: 'Arrendatario', depto: '', medioPreferido: 'Correo' });
    toast.success(`Residente ${nuevo.nombre} registrado exitosamente`);
  };

  const handleDesactivar = (id: number, nombre: string) => {
    setResidentes(prev =>
      prev.map(r => r.id === id ? { ...r, estado: r.estado === 'Activo' ? 'Inactivo' : 'Activo' } : r)
    );
    const estadoActual = residentes.find(r => r.id === id)?.estado;
    toast.success(`Usuario ${nombre} ${estadoActual === 'Activo' ? 'desactivado' : 'activado'}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Residentes</h2>
        <p className="text-muted-foreground text-sm mt-1">Gestión completa de residentes del edificio</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Gestión de Residentes
            </CardTitle>
            <Button onClick={() => setNuevoUsuarioOpen(true)} className="gap-2 w-full sm:w-auto" data-testid="btn-nuevo-residente">
              <UserPlus className="h-4 w-4" />
              Nuevo Residente
            </Button>
          </div>
          <div className="relative mt-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre, RUT, depto o correo..."
              className="pl-9"
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              data-testid="input-busqueda-residente"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>RUT</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Contacto</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Depto</TableHead>
                  <TableHead>Medio preferido</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array(5).fill(0).map((_, i) => (
                    <TableRow key={i}>
                      {Array(8).fill(0).map((__, j) => (
                        <TableCell key={j}><Skeleton className="h-4 w-24" /></TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : residenetesFiltrados.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                      No se encontraron residentes con ese criterio.
                    </TableCell>
                  </TableRow>
                ) : (
                  residenetesFiltrados.map((res) => (
                    <TableRow key={res.id} className={res.estado === 'Inactivo' ? 'opacity-60' : ''}>
                      <TableCell className="font-mono text-sm">{res.rut}</TableCell>
                      <TableCell className="font-medium">{res.nombre}</TableCell>
                      <TableCell className="text-sm">{res.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getRoleColor(res.rol)}>{res.rol}</Badge>
                      </TableCell>
                      <TableCell>{res.depto}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{res.medioPreferido}</TableCell>
                      <TableCell>
                        <Badge variant={res.estado === 'Activo' ? 'default' : 'secondary'}
                          className={res.estado === 'Activo' ? 'bg-emerald-500 hover:bg-emerald-600' : ''}>
                          {res.estado}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="icon" data-testid={`btn-edit-${res.id}`} title="Editar residente">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader><DialogTitle>Editar Residente</DialogTitle></DialogHeader>
                              <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                  <Label>Nombre</Label>
                                  <Input defaultValue={res.nombre} />
                                </div>
                                <div className="grid gap-2">
                                  <Label>RUT</Label>
                                  <Input defaultValue={res.rut} />
                                </div>
                                <div className="grid gap-2">
                                  <Label>Correo electrónico</Label>
                                  <Input defaultValue={res.email} type="email" />
                                </div>
                                <div className="grid gap-2">
                                  <Label>Departamento</Label>
                                  <Input defaultValue={res.depto} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="grid gap-2">
                                    <Label>Rol</Label>
                                    <Select defaultValue={res.rol}>
                                      <SelectTrigger><SelectValue /></SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="Propietario">Propietario</SelectItem>
                                        <SelectItem value="Arrendatario">Arrendatario</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div className="grid gap-2">
                                    <Label>Medio preferido</Label>
                                    <Select defaultValue={res.medioPreferido}>
                                      <SelectTrigger><SelectValue /></SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="Correo">Correo</SelectItem>
                                        <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                                        <SelectItem value="SMS">SMS</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                              </div>
                              <DialogFooter>
                                <Button variant="outline">Cancelar</Button>
                                <Button onClick={() => toast.success('Residente actualizado')}>Guardar cambios</Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>

                          <Button
                            variant="ghost" size="icon"
                            title={res.estado === 'Activo' ? 'Desactivar' : 'Activar'}
                            className={res.estado === 'Activo' ? 'text-amber-600 hover:text-amber-700' : 'text-emerald-600 hover:text-emerald-700'}
                            onClick={() => handleDesactivar(res.id, res.nombre)}
                            data-testid={`btn-toggle-${res.id}`}
                          >
                            <UserX className="h-4 w-4" />
                          </Button>

                          <Button variant="ghost" size="icon" className="text-destructive"
                            onClick={() => toast.success('Residente eliminado')}
                            data-testid={`btn-delete-${res.id}`} title="Eliminar">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>

        <Dialog open={nuevoUsuarioOpen} onOpenChange={setNuevoUsuarioOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>Registrar Nuevo Residente</DialogTitle></DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Nombre completo <span className="text-destructive">*</span></Label>
                <Input placeholder="Ej: Juan Soto Pérez" value={nuevoUsuario.nombre}
                  onChange={e => setNuevoUsuario(p => ({ ...p, nombre: e.target.value }))} />
              </div>
              <div className="grid gap-2">
                <Label>RUT <span className="text-destructive">*</span></Label>
                <Input placeholder="12.345.678-9" value={nuevoUsuario.rut}
                  onChange={e => setNuevoUsuario(p => ({ ...p, rut: e.target.value }))} />
              </div>
              <div className="grid gap-2">
                <Label>Correo electrónico <span className="text-destructive">*</span></Label>
                <Input type="email" placeholder="correo@ejemplo.cl" value={nuevoUsuario.email}
                  onChange={e => setNuevoUsuario(p => ({ ...p, email: e.target.value }))} />
              </div>
              <div className="grid gap-2">
                <Label>Departamento</Label>
                <Input placeholder="Ej: 3A" value={nuevoUsuario.depto}
                  onChange={e => setNuevoUsuario(p => ({ ...p, depto: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Rol</Label>
                  <Select value={nuevoUsuario.rol} onValueChange={v => setNuevoUsuario(p => ({ ...p, rol: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Propietario">Propietario</SelectItem>
                      <SelectItem value="Arrendatario">Arrendatario</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Medio preferido</Label>
                  <Select value={nuevoUsuario.medioPreferido} onValueChange={v => setNuevoUsuario(p => ({ ...p, medioPreferido: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Correo">Correo electrónico</SelectItem>
                      <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                      <SelectItem value="SMS">SMS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setNuevoUsuarioOpen(false)}>Cancelar</Button>
              <Button onClick={handleRegistrar}>Registrar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Card>

      {/* RF-05: Vínculos */}
      <VinculosSection />
    </div>
  );
}

// ─── SECCIÓN VÍNCULOS (RF-05) ───────────────────────────────────────────────
function VinculosSection() {
  const [vinculoOpen, setVinculoOpen] = useState(false);
  const [vinculos, setVinculos] = useState(mockVinculos);
  const [nuevoVinculo, setNuevoVinculo] = useState({
    depto: '', residente: '', rolVinculo: 'Propietario',
    vigenciaInicio: '', vigenciaFin: '', prioridad: '1', responsabilidad: 'Pago de GC'
  });

  const handleAgregarVinculo = () => {
    if (!nuevoVinculo.depto || !nuevoVinculo.residente) {
      toast.error("Depto y residente son obligatorios");
      return;
    }
    setVinculos(prev => [...prev, {
      id: prev.length + 1,
      depto: nuevoVinculo.depto,
      residenteId: 0,
      residente: nuevoVinculo.residente,
      rolVinculo: nuevoVinculo.rolVinculo,
      vigenciaInicio: nuevoVinculo.vigenciaInicio,
      vigenciaFin: nuevoVinculo.vigenciaFin,
      prioridad: parseInt(nuevoVinculo.prioridad),
      responsabilidad: nuevoVinculo.responsabilidad,
    }]);
    setVinculoOpen(false);
    toast.success("Vínculo creado correctamente");
  };

  const deptos = [...new Set(vinculos.map(v => v.depto))];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Link2 className="h-5 w-5" />
            Vínculos Personas – Propiedades
          </CardTitle>
          <Button variant="outline" onClick={() => setVinculoOpen(true)} className="gap-2" data-testid="btn-nuevo-vinculo">
            <UserPlus className="h-4 w-4" />
            Nuevo vínculo
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {deptos.map(depto => (
            <div key={depto} className="border rounded-lg p-4 bg-muted/30">
              <h3 className="font-semibold text-base mb-3 flex items-center gap-2">
                <Building2 className="h-4 w-4 text-primary" />
                Depto {depto}
              </h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Residente</TableHead>
                    <TableHead>Rol</TableHead>
                    <TableHead>Vigencia</TableHead>
                    <TableHead>Prioridad</TableHead>
                    <TableHead>Responsabilidad</TableHead>
                    <TableHead className="text-right">Acción</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vinculos.filter(v => v.depto === depto).map(v => (
                    <TableRow key={v.id}>
                      <TableCell className="font-medium">{v.residente}</TableCell>
                      <TableCell><Badge variant="outline">{v.rolVinculo}</Badge></TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {v.vigenciaInicio} — {v.vigenciaFin || 'Indefinido'}
                      </TableCell>
                      <TableCell><Badge variant="secondary">Prioridad {v.prioridad}</Badge></TableCell>
                      <TableCell className="text-sm">{v.responsabilidad}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="text-destructive"
                          onClick={() => { setVinculos(prev => prev.filter(x => x.id !== v.id)); toast.success("Vínculo eliminado"); }}>
                          Eliminar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ))}
        </div>
      </CardContent>

      <Dialog open={vinculoOpen} onOpenChange={setVinculoOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Asociar Persona a Propiedad</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Departamento <span className="text-destructive">*</span></Label>
                <Input placeholder="Ej: 4B" value={nuevoVinculo.depto} onChange={e => setNuevoVinculo(p => ({ ...p, depto: e.target.value }))} />
              </div>
              <div className="grid gap-2">
                <Label>Residente <span className="text-destructive">*</span></Label>
                <Input placeholder="Nombre completo" value={nuevoVinculo.residente} onChange={e => setNuevoVinculo(p => ({ ...p, residente: e.target.value }))} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Rol del vínculo</Label>
                <Select value={nuevoVinculo.rolVinculo} onValueChange={v => setNuevoVinculo(p => ({ ...p, rolVinculo: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Propietario">Propietario</SelectItem>
                    <SelectItem value="Inmobiliaria">Inmobiliaria</SelectItem>
                    <SelectItem value="Arrendatario">Arrendatario</SelectItem>
                    <SelectItem value="Corredor">Corredor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Prioridad</Label>
                <Select value={nuevoVinculo.prioridad} onValueChange={v => setNuevoVinculo(p => ({ ...p, prioridad: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 (Principal)</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Fecha inicio</Label>
                <Input type="date" value={nuevoVinculo.vigenciaInicio} onChange={e => setNuevoVinculo(p => ({ ...p, vigenciaInicio: e.target.value }))} />
              </div>
              <div className="grid gap-2">
                <Label>Fecha fin (opcional)</Label>
                <Input type="date" value={nuevoVinculo.vigenciaFin} onChange={e => setNuevoVinculo(p => ({ ...p, vigenciaFin: e.target.value }))} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Tipo de responsabilidad</Label>
              <Select value={nuevoVinculo.responsabilidad} onValueChange={v => setNuevoVinculo(p => ({ ...p, responsabilidad: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pago de GC">Pago de gastos comunes</SelectItem>
                  <SelectItem value="Contacto emergencia">Contacto de emergencia</SelectItem>
                  <SelectItem value="Representante legal">Representante legal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setVinculoOpen(false)}>Cancelar</Button>
            <Button onClick={handleAgregarVinculo}>Crear vínculo</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

// ─── SECCIÓN DEPARTAMENTOS ──────────────────────────────────────────────────
function DepartamentosSection() {
  const [busqueda, setBusqueda] = useState("");
  const deptos = mockDepartamentos.filter(d =>
    d.numero.toLowerCase().includes(busqueda.toLowerCase()) ||
    (d.propietario ?? '').toLowerCase().includes(busqueda.toLowerCase()) ||
    (d.arrendatario ?? '').toLowerCase().includes(busqueda.toLowerCase())
  );
  const ocupados = mockDepartamentos.filter(d => d.estado === 'Ocupado').length;
  const disponibles = mockDepartamentos.filter(d => d.estado === 'Disponible').length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Departamentos</h2>
        <p className="text-muted-foreground text-sm mt-1">Inventario y estado de todas las unidades del edificio</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Total unidades</p>
            <p className="text-3xl font-bold mt-1">{mockDepartamentos.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Ocupados</p>
            <p className="text-3xl font-bold mt-1 text-primary">{ocupados}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Disponibles</p>
            <p className="text-3xl font-bold mt-1 text-emerald-600">{disponibles}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Unidades
            </CardTitle>
            <Button className="gap-2 w-full sm:w-auto" onClick={() => toast.success("Función disponible próximamente")}>
              <UserPlus className="h-4 w-4" />
              Nueva Unidad
            </Button>
          </div>
          <div className="relative mt-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar por número, propietario o arrendatario..." className="pl-9"
              value={busqueda} onChange={e => setBusqueda(e.target.value)} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Depto</TableHead>
                  <TableHead>Piso</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Superficie</TableHead>
                  <TableHead>Propietario</TableHead>
                  <TableHead>Arrendatario</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {deptos.map(d => (
                  <TableRow key={d.id}>
                    <TableCell className="font-bold">{d.numero}</TableCell>
                    <TableCell>{d.piso}</TableCell>
                    <TableCell className="text-sm">{d.tipo}</TableCell>
                    <TableCell className="text-sm">{d.superficie} m²</TableCell>
                    <TableCell className="text-sm">{d.propietario ?? '—'}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{d.arrendatario ?? '—'}</TableCell>
                    <TableCell>
                      <Badge variant={d.estado === 'Ocupado' ? 'default' : 'secondary'}
                        className={d.estado === 'Ocupado' ? 'bg-primary' : 'bg-emerald-100 text-emerald-800'}>
                        {d.estado}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => toast.success("Editar depto " + d.numero)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── SECCIÓN PAGOS (RF-25) ──────────────────────────────────────────────────
function PagosSection() {
  const pagosAtrasados = mockPagos.filter(p => p.estado === 'Atrasado');
  const totalMorosidad = pagosAtrasados.reduce((acc, p) => acc + p.monto, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Pagos y Morosidad</h2>
        <p className="text-muted-foreground text-sm mt-1">Control de pagos, pendientes y morosos</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Total recaudado</p>
            <p className="text-3xl font-bold mt-1 text-emerald-600">
              ${mockPagos.filter(p => p.estado === 'Pagado').reduce((a, p) => a + p.monto, 0).toLocaleString('es-CL')}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Pendientes</p>
            <p className="text-3xl font-bold mt-1 text-amber-600">
              {mockPagos.filter(p => p.estado === 'Pendiente').length}
            </p>
          </CardContent>
        </Card>
        <Card className="border-destructive/40 bg-destructive/5">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground text-destructive">Morosidad total</p>
            <p className="text-3xl font-bold mt-1 text-destructive">${totalMorosidad.toLocaleString('es-CL')}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Todos los Pagos</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Residente</TableHead>
                  <TableHead>Concepto</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockPagos.map(pago => (
                  <TableRow key={pago.id}>
                    <TableCell>
                      <p className="font-medium text-sm">{pago.residente}</p>
                      <p className="text-xs text-muted-foreground">Depto {pago.depto}</p>
                    </TableCell>
                    <TableCell className="text-sm">{pago.concepto}</TableCell>
                    <TableCell className="font-medium">${pago.monto.toLocaleString('es-CL')}</TableCell>
                    <TableCell>
                      <Badge
                        variant={pago.estado === 'Pagado' ? 'default' : pago.estado === 'Atrasado' ? 'destructive' : 'secondary'}
                        className={pago.estado === 'Pagado' ? 'bg-emerald-500 hover:bg-emerald-600' : pago.estado === 'Pendiente' ? 'bg-amber-500 hover:bg-amber-600 text-white' : ''}>
                        {pago.estado}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="border-destructive/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Residentes con Pagos Atrasados
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pagosAtrasados.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-8">Sin pagos atrasados.</p>
            ) : (
              <div className="space-y-4">
                {pagosAtrasados.map(pago => (
                  <div key={pago.id} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                    <div>
                      <p className="font-medium">{pago.residente}</p>
                      <p className="text-sm text-muted-foreground">Depto {pago.depto} — {pago.concepto}</p>
                      <p className="text-sm font-semibold text-destructive">${pago.monto.toLocaleString('es-CL')}</p>
                    </div>
                    <Button variant="outline" size="sm"
                      className="gap-1 border-destructive/30 text-destructive hover:bg-destructive/10"
                      onClick={() => toast.success(`Recordatorio enviado a ${pago.residente}`)}
                      data-testid={`btn-recordatorio-${pago.id}`}>
                      <Send className="h-3.5 w-3.5" />
                      Recordatorio
                    </Button>
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

// ─── SECCIÓN REPORTES ────────────────────────────────────────────────────────
function ReportesSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Reportes</h2>
        <p className="text-muted-foreground text-sm mt-1">Exportación de informes y estadísticas del edificio</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Reportes de Pagos</CardTitle>
            <CardDescription>Informes financieros mensuales y anuales</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { label: 'Reporte mensual enero 2025', subtitle: 'Todos los pagos del mes' },
              { label: 'Reporte anual 2024', subtitle: 'Resumen financiero del año' },
              { label: 'Informe de morosidad', subtitle: 'Detalles de pagos atrasados' },
            ].map((rep, i) => (
              <div key={i} className="flex items-center justify-between p-3 border rounded-lg bg-muted/30">
                <div>
                  <p className="font-medium text-sm">{rep.label}</p>
                  <p className="text-xs text-muted-foreground">{rep.subtitle}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="gap-1.5"
                    onClick={() => toast.success("PDF descargado")}>
                    <Download className="h-3.5 w-3.5" />PDF
                  </Button>
                  <Button size="sm" variant="outline" className="gap-1.5"
                    onClick={() => toast.success("Excel descargado")}>
                    <FileText className="h-3.5 w-3.5" />Excel
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reportes de Residentes</CardTitle>
            <CardDescription>Listados y estadísticas de ocupación</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { label: 'Listado de residentes activos', subtitle: 'Con datos de contacto' },
              { label: 'Informe de ocupación', subtitle: '92% de ocupación actual' },
              { label: 'Reporte de solicitudes', subtitle: 'Estado de todas las solicitudes' },
            ].map((rep, i) => (
              <div key={i} className="flex items-center justify-between p-3 border rounded-lg bg-muted/30">
                <div>
                  <p className="font-medium text-sm">{rep.label}</p>
                  <p className="text-xs text-muted-foreground">{rep.subtitle}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="gap-1.5"
                    onClick={() => toast.success("PDF descargado")}>
                    <Download className="h-3.5 w-3.5" />PDF
                  </Button>
                  <Button size="sm" variant="outline" className="gap-1.5"
                    onClick={() => toast.success("Excel descargado")}>
                    <FileText className="h-3.5 w-3.5" />Excel
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Log de Actividad del Sistema</CardTitle>
          <CardDescription>Registro de acciones realizadas en el sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockLogActividad.map(log => (
              <div key={log.id} className="flex items-start gap-3 border-b pb-3 last:border-0 last:pb-0">
                <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
                <div className="flex-1">
                  <p className="text-sm">{log.accion}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{log.usuario} • {log.fecha}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── SECCIÓN SOLICITUDES ─────────────────────────────────────────────────────
function SolicitudesSection() {
  const [solicitudes, setSolicitudes] = useState(mockSolicitudes);

  const getPrioridadColor = (p: string) => {
    if (p === 'Alta') return 'destructive';
    if (p === 'Media') return 'default';
    return 'secondary';
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Solicitudes</h2>
        <p className="text-muted-foreground text-sm mt-1">Gestión de solicitudes y reclamos de residentes</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Pendientes', count: solicitudes.filter(s => s.estado === 'Pendiente').length, color: 'text-amber-600' },
          { label: 'En Proceso', count: solicitudes.filter(s => s.estado === 'En Proceso').length, color: 'text-primary' },
          { label: 'Resueltas', count: solicitudes.filter(s => s.estado === 'Listo').length, color: 'text-emerald-600' },
        ].map((stat, i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className={`text-3xl font-bold mt-1 ${stat.color}`}>{stat.count}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle>Todas las Solicitudes</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-4">
            {solicitudes.map(sol => (
              <div key={sol.id} className="border rounded-lg p-4 bg-card flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold">Depto {sol.depto}</span>
                    <Badge variant={getPrioridadColor(sol.prioridad) as "destructive" | "default" | "secondary"}>
                      Prioridad {sol.prioridad}
                    </Badge>
                  </div>
                  <p className="font-medium text-primary">{sol.tipo}</p>
                  <p className="text-sm text-muted-foreground mt-1">{sol.descripcion}</p>
                  <p className="text-xs text-muted-foreground mt-2">{sol.residente} • {sol.fecha}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Select defaultValue={sol.estado}
                    onValueChange={(val) => {
                      setSolicitudes(prev => prev.map(s => s.id === sol.id ? { ...s, estado: val } : s));
                      toast.success(`Solicitud actualizada a: ${val}`);
                    }}>
                    <SelectTrigger className="w-36">
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

// ─── SECCIÓN NOTIFICACIONES ──────────────────────────────────────────────────
function NotificacionesSection() {
  const [titulo, setTitulo] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [tipo, setTipo] = useState('info');

  const tipoColor = (t: string) => {
    if (t === 'warning') return 'border-amber-200 bg-amber-50 dark:bg-amber-900/10';
    return 'border-blue-200 bg-blue-50 dark:bg-blue-900/10';
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Notificaciones</h2>
        <p className="text-muted-foreground text-sm mt-1">Envío y gestión de comunicados a los residentes</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Nueva Notificación
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label>Título</Label>
              <Input placeholder="Ej: Corte de agua programado" value={titulo} onChange={e => setTitulo(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label>Mensaje</Label>
              <textarea
                className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                placeholder="Describe el comunicado..."
                value={mensaje}
                onChange={e => setMensaje(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label>Tipo</Label>
              <Select value={tipo} onValueChange={setTipo}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="info">Informativo</SelectItem>
                  <SelectItem value="warning">Advertencia</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Enviar a</Label>
              <Select defaultValue="todos">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los residentes</SelectItem>
                  <SelectItem value="propietarios">Solo propietarios</SelectItem>
                  <SelectItem value="arrendatarios">Solo arrendatarios</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full gap-2" onClick={() => {
              if (!titulo || !mensaje) { toast.error("Completa título y mensaje"); return; }
              toast.success("Notificación enviada a todos los residentes");
              setTitulo(''); setMensaje('');
            }}>
              <Send className="h-4 w-4" />
              Enviar Notificación
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Notificaciones Enviadas</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockNotificaciones.map(notif => (
                <div key={notif.id} className={`p-4 rounded-lg border ${tipoColor(notif.tipo)}`}>
                  <p className="font-medium text-sm mb-1">{notif.titulo}</p>
                  <p className="text-sm text-muted-foreground">{notif.mensaje}</p>
                  <p className="text-xs text-muted-foreground mt-2">{notif.fecha}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ─── SECCIÓN CONFIGURACIÓN ───────────────────────────────────────────────────
function ConfiguracionSection() {
  const [notifCorreo, setNotifCorreo] = useState(true);
  const [notifWA, setNotifWA] = useState(true);
  const [notifSMS, setNotifSMS] = useState(false);
  const [diasRecordatorio, setDiasRecordatorio] = useState('3');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Configuración</h2>
        <p className="text-muted-foreground text-sm mt-1">Ajustes generales del sistema</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Datos del Edificio</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label>Nombre del edificio</Label>
              <Input defaultValue="Edificio El Mirador" />
            </div>
            <div className="grid gap-2">
              <Label>Dirección</Label>
              <Input defaultValue="Av. Libertad 1250, Concepción" />
            </div>
            <div className="grid gap-2">
              <Label>RUT Comunidad</Label>
              <Input defaultValue="76.543.210-K" />
            </div>
            <div className="grid gap-2">
              <Label>Correo administración</Label>
              <Input defaultValue="admin@mirador.cl" type="email" />
            </div>
            <div className="grid gap-2">
              <Label>Teléfono conserjería</Label>
              <Input defaultValue="+56 41 234 5678" />
            </div>
            <Button className="w-full" onClick={() => toast.success("Configuración guardada")}>
              Guardar cambios
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notificaciones Automáticas</CardTitle>
              <CardDescription>Canales habilitados para envío de recordatorios</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: 'Correo electrónico', icon: MailOpen, value: notifCorreo, onChange: setNotifCorreo },
                { label: 'WhatsApp', icon: MessageSquare, value: notifWA, onChange: setNotifWA },
                { label: 'SMS', icon: Phone, value: notifSMS, onChange: setNotifSMS },
              ].map(({ label, icon: Icon, value, onChange }, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <Label className="cursor-pointer">{label}</Label>
                  </div>
                  <Switch checked={value} onCheckedChange={onChange} />
                </div>
              ))}
              <Separator />
              <div className="grid gap-2">
                <Label>Días de anticipación para recordatorio</Label>
                <Select value={diasRecordatorio} onValueChange={setDiasRecordatorio}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 día antes</SelectItem>
                    <SelectItem value="3">3 días antes</SelectItem>
                    <SelectItem value="5">5 días antes</SelectItem>
                    <SelectItem value="7">7 días antes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Configuración de Pagos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label>Día de vencimiento mensual</Label>
                <Select defaultValue="10">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {[5, 10, 15, 20].map(d => (
                      <SelectItem key={d} value={String(d)}>Día {d} de cada mes</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Banco de destino</Label>
                <Input defaultValue="Banco de Chile" />
              </div>
              <div className="grid gap-2">
                <Label>Número de cuenta</Label>
                <Input defaultValue="123456789" />
              </div>
              <Button variant="outline" className="w-full" onClick={() => toast.success("Configuración de pagos guardada")}>
                Guardar
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ─── SECCIÓN RESUMEN ─────────────────────────────────────────────────────────
function ResumenSection({ pagosAtrasados, totalMorosidad, ultimaActualizacion, handleRefrescar }: {
  pagosAtrasados: typeof mockPagos;
  totalMorosidad: number;
  ultimaActualizacion: string;
  handleRefrescar: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Resumen General</h2>
          <p className="text-muted-foreground text-sm mt-1">Vista consolidada del estado del edificio</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            Actualizado: {ultimaActualizacion}
          </span>
          <Button variant="outline" size="sm" onClick={handleRefrescar} className="gap-2" data-testid="btn-refrescar">
            <RefreshCw className="h-4 w-4" />
            Refrescar
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {[
          { label: 'Residentes', value: '370', icon: Users, color: '' },
          { label: 'Pagos Pendientes', value: '38', icon: CreditCard, color: 'text-amber-600' },
          { label: 'Solicitudes Activas', value: '16', icon: ClipboardList, color: 'text-primary' },
          { label: 'Ocupación', value: '92%', icon: Building2, color: '', sub: '147 de 160 deptos' },
        ].map((stat, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              {stat.sub && <p className="text-xs text-muted-foreground mt-1">{stat.sub}</p>}
            </CardContent>
          </Card>
        ))}

        <Card className="border-destructive/40 bg-destructive/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-destructive">Morosidad</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{pagosAtrasados.length}</div>
            <p className="text-xs text-muted-foreground mt-1">${totalMorosidad.toLocaleString('es-CL')} adeudados</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Últimas Solicitudes</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockSolicitudes.slice(0, 3).map(sol => (
                <div key={sol.id} className="flex justify-between items-start border-b pb-3 last:border-0 last:pb-0">
                  <div>
                    <p className="font-medium text-sm">{sol.tipo} — Depto {sol.depto}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{sol.residente}</p>
                  </div>
                  <Badge variant="outline">{sol.estado}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Últimos Pagos</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockPagos.slice(0, 4).map(pago => (
                <div key={pago.id} className="flex justify-between items-center border-b pb-3 last:border-0 last:pb-0">
                  <div>
                    <p className="font-medium text-sm">{pago.residente}</p>
                    <p className="text-xs text-muted-foreground">${pago.monto.toLocaleString('es-CL')}</p>
                  </div>
                  <Badge
                    variant={pago.estado === 'Pagado' ? 'default' : pago.estado === 'Atrasado' ? 'destructive' : 'secondary'}
                    className={pago.estado === 'Pagado' ? 'bg-emerald-500' : pago.estado === 'Pendiente' ? 'bg-amber-500 text-white' : ''}>
                    {pago.estado}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ─── DASHBOARD PRINCIPAL ─────────────────────────────────────────────────────
export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [location, setLocation] = useLocation();
  const [ultimaActualizacion, setUltimaActualizacion] = useState(() =>
    new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })
  );

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      setLocation("/login");
    }
  }, [user, setLocation]);

  if (!user || user.role !== 'admin') return null;

  const handleRefrescar = () => {
    setUltimaActualizacion(new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' }));
    toast.success("Datos actualizados");
  };

  const pagosAtrasados = mockPagos.filter(p => p.estado === 'Atrasado');
  const totalMorosidad = pagosAtrasados.reduce((acc, p) => acc + p.monto, 0);

  // Extraer sección desde la URL: /admin/residentes → "residentes"
  const seccion = location.split('/')[2] ?? '';

  const renderSeccion = () => {
    switch (seccion) {
      case 'residentes':     return <ResidentesSection />;
      case 'departamentos':  return <DepartamentosSection />;
      case 'pagos':          return <PagosSection />;
      case 'reportes':       return <ReportesSection />;
      case 'solicitudes':    return <SolicitudesSection />;
      case 'notificaciones': return <NotificacionesSection />;
      case 'configuracion':  return <ConfiguracionSection />;
      default:               return (
        <ResumenSection
          pagosAtrasados={pagosAtrasados}
          totalMorosidad={totalMorosidad}
          ultimaActualizacion={ultimaActualizacion}
          handleRefrescar={handleRefrescar}
        />
      );
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 flex">
      <Sidebar items={SIDEBAR_ITEMS} />

      <main className="flex-1 md:ml-64 p-6 pt-20 md:pt-6">
        {/* Header con rol */}
        <div className="flex items-center gap-3 mb-6">
          <ShieldCheck className="h-5 w-5 text-primary" />
          <Badge className="bg-primary/10 text-primary border border-primary/20 font-medium">
            Administrador — {user.nombre}
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
