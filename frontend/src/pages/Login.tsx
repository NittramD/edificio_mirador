import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useLocation } from "wouter";
import { Building2, Loader2 } from "lucide-react";

import { useAuth, Role } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Navbar } from "@/components/Navbar";

const loginSchema = z.object({
  email: z.string().email({ message: "Ingresa un correo válido" }),
  password: z.string().min(1, { message: "La contraseña es requerida" }),
});

export default function Login() {
  const { login, user } = useAuth();
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setLocation(user.redirectTo);
    }
  }, [user, setLocation]);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    setIsLoading(true);
    // Simular latencia de red
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const success = login(values.email, values.password);
    
    if (!success) {
      toast.error("Credenciales incorrectas", {
        description: "Revisa tu correo o contraseña y vuelve a intentar."
      });
    }
    
    setIsLoading(false);
  };

  const fillDemo = (role: Role) => {
    const creds: Record<Role, {e:string, p:string}> = {
      admin: { e: 'admin@mirador.cl', p: 'admin123' },
      owner: { e: 'propietario@mirador.cl', p: 'prop123' },
      tenant: { e: 'arrendatario@mirador.cl', p: 'arr123' },
      maintenance: { e: 'mantencion@mirador.cl', p: 'mant123' },
    };
    form.setValue("email", creds[role].e);
    form.setValue("password", creds[role].p);
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="border-0 shadow-lg">
            <CardHeader className="space-y-1 items-center text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Building2 className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-2xl font-bold">Iniciar Sesión</CardTitle>
              <CardDescription>
                Ingresa a tu cuenta de El Mirador
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Correo electrónico</FormLabel>
                        <FormControl>
                          <Input placeholder="tu@correo.cl" {...field} data-testid="input-email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contraseña</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} data-testid="input-password" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isLoading} data-testid="button-submit">
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Entrar a mi cuenta
                  </Button>
                </form>
              </Form>

              <div className="mt-8">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Demo Accounts</span>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" onClick={() => fillDemo('admin')} data-testid="demo-admin">Admin</Button>
                  <Button variant="outline" size="sm" onClick={() => fillDemo('owner')} data-testid="demo-owner">Propietario</Button>
                  <Button variant="outline" size="sm" onClick={() => fillDemo('tenant')} data-testid="demo-tenant">Arrendatario</Button>
                  <Button variant="outline" size="sm" onClick={() => fillDemo('maintenance')} data-testid="demo-maint">Mantención</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
