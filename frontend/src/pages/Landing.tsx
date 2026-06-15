import { useEffect, useRef } from "react";
import * as THREE from "three";
import { motion } from "framer-motion";
import { CreditCard, ClipboardList, BarChart3, Bell } from "lucide-react";
import { Navbar } from "@/components/Navbar";

export default function Landing() {
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    } catch {
      // WebGL not available — fallback CSS building is shown instead
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    
    renderer.setSize(canvasRef.current.clientWidth, 400);
    canvasRef.current.appendChild(renderer.domElement);

    // Edificio
    const buildingGeometry = new THREE.BoxGeometry(2, 6, 2);
    const buildingMaterial = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.7 });
    const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
    scene.add(building);

    // Ventanas
    const windowGeometry = new THREE.BoxGeometry(0.2, 0.3, 0.1);
    const windowMaterial = new THREE.MeshStandardMaterial({ color: 0xfacc15, emissive: 0xfacc15, emissiveIntensity: 0.5 });
    
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 3; j++) {
        // Frente
        const w1 = new THREE.Mesh(windowGeometry, windowMaterial);
        w1.position.set(-0.6 + j * 0.6, -2 + i * 1, 1.01);
        building.add(w1);
        
        // Atrás
        const w2 = new THREE.Mesh(windowGeometry, windowMaterial);
        w2.position.set(-0.6 + j * 0.6, -2 + i * 1, -1.01);
        building.add(w2);
      }
    }

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    camera.position.z = 8;
    camera.position.y = 1;

    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      building.rotation.y += 0.005;
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!canvasRef.current) return;
      camera.aspect = canvasRef.current.clientWidth / 400;
      camera.updateProjectionMatrix();
      renderer.setSize(canvasRef.current.clientWidth, 400);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      if (canvasRef.current && renderer.domElement) {
        canvasRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-slate-900 text-white dark:bg-background">
          <div className="container mx-auto px-4 py-20 lg:py-32 flex flex-col lg:flex-row items-center gap-12">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex-1 text-center lg:text-left z-10"
            >
              <h1 className="text-4xl lg:text-6xl font-bold tracking-tight mb-6">
                Administración transparente para tu comunidad
              </h1>
              <p className="text-lg lg:text-xl text-slate-300 mb-8 max-w-2xl mx-auto lg:mx-0">
                Sistema de gestión moderna para el Edificio El Mirador. Paga tus gastos comunes, reporta problemas y mantente informado, todo en un solo lugar.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex-1 w-full flex justify-center"
            >
              <div ref={canvasRef} className="w-full max-w-md h-[400px]" />
            </motion.div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4 text-foreground">Todo lo que necesitas</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">Una plataforma pensada para hacerle la vida más fácil a residentes y a la administración.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: CreditCard, title: "Gestión de Pagos", desc: "Revisa y paga tus gastos comunes de forma segura." },
                { icon: ClipboardList, title: "Solicitudes Online", desc: "Ingresa requerimientos de mantención al instante." },
                { icon: BarChart3, title: "Reportes Automáticos", desc: "Transparencia total en los gastos de la comunidad." },
                { icon: Bell, title: "Comunicaciones", desc: "Avisos y notificaciones importantes directo a tu correo." }
              ].map((feature, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-card p-6 rounded-xl shadow-sm border"
                >
                  <div className="h-12 w-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-xl mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center"
            >
              {[
                { label: "Departamentos", value: "160" },
                { label: "Residentes", value: "370" },
                { label: "Ocupación", value: "92%" },
                { label: "Pagos del mes", value: "$8.0M" }
              ].map((stat, i) => (
                <div key={i}>
                  <div className="text-4xl lg:text-5xl font-bold text-primary mb-2">{stat.value}</div>
                  <div className="text-sm text-muted-foreground uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="bg-slate-900 text-slate-400 py-8 text-center text-sm">
        <div className="container mx-auto px-4">
          <p>Edificio El Mirador | Av. Edmundo Larenas 1234, Concepción</p>
          <p className="mt-2">admin@mirador.cl | +56 41 234 5678</p>
        </div>
      </footer>
    </div>
  );
}
