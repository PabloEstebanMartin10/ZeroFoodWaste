import React, { useRef, useEffect, useState } from "react";
import LogoFull from "../../assets/logos/Logo_ZeroFoodWasteTransparent.png";
import MickaelImg from "../../assets/homePictures/Mickael.jpg";
import CynthiaImg from "../../assets/homePictures/Cynthia.jpg";
import IgnacioImg from "../../assets/homePictures/Ignacio.jpg";
import PabloImg from "../../assets/homePictures/Pablo.jpg";

// Hook para detectar visibilidad (mantenemos tu lógica, funciona bien)
const useOnScreenOnce = (
  ref: React.RefObject<HTMLElement>,
  threshold = 0.1
) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, threshold]);

  return isVisible;
};

// Componente para animar secciones al entrar en el viewport
const FadeInSection = ({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useOnScreenOnce(ref);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-1000 ease-out transform ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"
      }`}
    >
      {children}
    </div>
  );
};

export const Home = () => {
  const [scrollY, setScrollY] = useState(0);

  // Listener para efectos de parallax simples
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const teamMembers = [
    {
      name: "Cynthia",
      role: "Desarrolladora Frontend",
      img: CynthiaImg,
      desc: "Desarrollo frontend con React + JavaScript, maquetación y consumo de API REST.",
    },
    {
      name: "Ignacio",
      role: "Desarrolador Full-stack & Coordinador",
      img: IgnacioImg,
      desc: "Coordinación, documentación, React + JavaScript y estrategia de producto.",
    },
    {
      name: "Pablo E",
      role: "Desarrollador Backend",
      img: PabloImg,
      desc: "Arquitectura backend Java + Spring Boot, seguridad y diseño de API REST.",
    },
    {
      name: "Mickael",
      role: "Desarrollador Full-stack",
      img: MickaelImg,
      desc: "Integración full-stack, MySQL, modelado de datos y lógica de negocio.",
    },
  ];

  return (
    <div className="relative w-full">
      {/* === SECCIÓN HERO PARALLAX === 
        Esta sección está fija (fixed) al fondo. El resto del contenido pasará por encima.
      */}
      <div className="fixed top-0 left-0 w-full h-screen -z-10 flex flex-col items-center justify-center bg-gradient-to-b from-amber-50 to-white overflow-hidden">
        {/* Círculos decorativos de fondo */}
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-green-200 rounded-full blur-3xl opacity-30 animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-orange-200 rounded-full blur-3xl opacity-30 animate-pulse" />

        {/* Logo con efecto de escala al hacer scroll */}
        <div
          className="relative z-10 transition-transform duration-100 ease-out"
          style={{
            transform: `translateY(${scrollY * 0.5}px) scale(${Math.max(
              0.8,
              1 - scrollY / 1000
            )})`,
            opacity: Math.max(0, 1 - scrollY / 700),
          }}
        >
          <img
            src={LogoFull}
            alt="ZeroFoodWaste Logo"
            className="w-[280px] md:w-[500px] object-contain drop-shadow-2xl"
          />
        </div>

        {/* Indicador de Scroll */}
        <div
          className="absolute bottom-10 flex flex-col items-center animate-bounce text-gray-400"
          style={{ opacity: Math.max(0, 1 - scrollY / 300) }}
        >
          <span className="text-sm uppercase tracking-widest mb-2">
            Descubre más
          </span>
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </div>

      {/* === CONTENIDO PRINCIPAL === 
        Margen superior de 100vh para dejar ver el Hero al principio.
        Fondo blanco sólido para tapar el hero al subir.
        Bordes redondeados superiores para efecto "tarjeta".
      */}
      <div className="relative mt-[100vh] bg-white rounded-t-[3rem] shadow-[0_-25px_50px_-12px_rgba(0,0,0,0.1)] overflow-hidden">
        {/* Misión */}
        <section className="py-24 px-6 md:px-20 lg:px-40 text-center">
          <FadeInSection>
            <span className="inline-block py-1 px-3 rounded-full bg-green-100 text-green-700 text-sm font-bold tracking-wide mb-6">
              NUESTRA MISIÓN
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-8 leading-tight tracking-tight">
              Convertir el desperdicio <br className="hidden md:block" />
              en{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-400">
                seguridad alimentaria
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Conectamos restaurantes con excedentes de comida con bancos de
              alimentos que sirven a comunidades necesitadas. Juntos, estamos
              reduciendo el desperdicio y combatiendo el hambre.
            </p>
          </FadeInSection>
        </section>

        {/* Cards: Cómo funciona */}
        <section className="py-20 px-6 md:px-20 bg-slate-50">
          <div className="container mx-auto">
            <FadeInSection>
              <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  ¿Cómo funciona ZeroFoodWaste?
                </h2>
                <p className="text-gray-500 max-w-2xl mx-auto">
                  Una plataforma sencilla que crea conexiones significativas
                  entre donadores de alimentos y quienes más los necesitan.
                </p>
              </div>
            </FadeInSection>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Card 1 */}
              <FadeInSection delay={100}>
                <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 h-full">
                  <div className="w-16 h-16 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 13V6a2 2 0 00-2-2h-4l-2-2-2 2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0H4"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Publicación Simple
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Los restaurantes suben sus excedentes en segundos, indicando
                    tipo de alimento, cantidad y hora de recogida.
                  </p>
                </div>
              </FadeInSection>

              {/* Card 2 */}
              <FadeInSection delay={200}>
                <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 h-full">
                  <div className="w-16 h-16 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2 0 1.105 1.343 2 3 2s3-.895 3-2c0-1.105-1.343-2-3-2zm0 0V3m0 5c-1.105 0-2 .895-2 2 0 1.105.895 2 2 2m0 0v5m0-5c1.105 0 2-.895 2-2 0-1.105-.895-2-2-2"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Conexión Inmediata
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Los bancos de alimentos reciben notificaciones en tiempo
                    real y reservan las donaciones que necesitan.
                  </p>
                </div>
              </FadeInSection>

              {/* Card 3 */}
              <FadeInSection delay={300}>
                <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 h-full">
                  <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 17a4 4 0 004 4h10a4 4 0 004-4M7 7l5-5 5 5M12 2v12"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Impacto Real
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Menos comida en la basura, más platos en la mesa. Generamos
                    métricas de impacto ambiental y social.
                  </p>
                </div>
              </FadeInSection>
            </div>
          </div>
        </section>

        {/* Sección CTA (Call to Action) */}
        <section className="py-20 px-6">
          <FadeInSection>
            <div className="container mx-auto bg-gradient-to-r from-green-900 to-green-800 rounded-3xl p-12 md:p-20 text-center shadow-2xl relative overflow-hidden">
              {/* Elemento decorativo */}
              <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-orange-500 opacity-10 rounded-full blur-3xl" />

              <h3 className="text-3xl md:text-5xl font-bold text-white mb-6 relative z-10">
                Únete a la revolución contra el desperdicio
              </h3>
              <p className="text-lg text-green-100 max-w-2xl mx-auto mb-10 relative z-10">
                Ya seas un restaurante comprometido con la sostenibilidad o una
                organización que ayuda a los demás, aquí está tu lugar.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
                <button className="px-8 py-4 bg-orange-500 text-white font-semibold rounded-full hover:bg-orange-600 hover:shadow-lg hover:scale-105 transition-all duration-300">
                  Soy un Restaurante
                </button>
                <button className="px-8 py-4 bg-white text-green-900 font-semibold rounded-full hover:bg-gray-100 hover:shadow-lg hover:scale-105 transition-all duration-300">
                  Soy un Banco de Alimentos
                </button>
              </div>
            </div>
          </FadeInSection>
        </section>

        {/* El Equipo */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6 md:px-20">
            <FadeInSection>
              <div className="text-center mb-16">
                <h3 className="text-4xl font-bold text-gray-900 mb-4">
                  Nuestro Equipo
                </h3>
                <p className="text-gray-500 max-w-2xl mx-auto">
                  Mentes creativas unidas por la tecnología y el compromiso
                  social.
                </p>
              </div>
            </FadeInSection>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member, index) => (
                <FadeInSection key={member.name} delay={index * 100}>
                  <div className="flex flex-col items-center text-center group">
                    <div className="relative mb-6">
                      <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-xl group-hover:scale-105 transition-transform duration-300">
                        <img
                          src={member.img}
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute bottom-2 right-2 w-8 h-8 bg-green-500 border-2 border-white rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">✓</span>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {member.name}
                    </h3>
                    <p className="text-green-600 font-medium text-sm mb-3">
                      {member.role}
                    </p>
                    <p className="text-gray-500 text-sm px-4 leading-relaxed">
                      {member.desc}
                    </p>
                  </div>
                </FadeInSection>
              ))}
            </div>
          </div>
        </section>

        {/* Footer simple (opcional, para cerrar la página) */}
        <footer className="bg-gray-50 py-8 text-center text-gray-400 text-sm">
          <p>
            © {new Date().getFullYear()} ZeroFoodWaste. Todos los derechos
            reservados.
          </p>
        </footer>
      </div>
    </div>
  );
};
