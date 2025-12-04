import React, { useRef } from "react";
import LogoFull from "../../assets/logos/Logo_ZeroFoodWasteTransparent.png";
import MickaelImg from "../../assets/homePictures/Mickael.jpg";
import CynthiaImg from "../../assets/homePictures/Cynthia.jpg";
import IgnacioImg from "../../assets/homePictures/Ignacio.jpg";
import PabloImg from "../../assets/homePictures/Pablo.jpg";

// Hook para animación al aparecer una sola vez
const useOnScreenOnce = (
  ref: React.RefObject<HTMLElement>,
  threshold = 0.2
) => {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target); // se desconecta después de la primera vez
        }
      },
      { threshold }
    );

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [ref, threshold]);

  return isVisible;
};

// Componente animado
const AnimatedSection = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useOnScreenOnce(ref);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out mb-12 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      {children}
    </div>
  );
};

export const Home = () => {
  const teamMembers = [
    {
      name: "Cynthia",
      role: "Desarrolladora Front-end",
      img: CynthiaImg,
      desc: "Desarrollo frontend con React + JavaScript, maquetación y consumo de API REST",
    },
    {
      name: "Ignacio",
      role: "Desarrollador Front-end, Coordinador",
      img: IgnacioImg,
      desc: "Coordinación, documentación, React + JavaScript, maquetación y consumo de API REST",
    },
    {
      name: "Pablo E",
      role: "Desarrollador Backend",
      img: PabloImg,
      desc: "Desarrollo backend con Java + Spring Boot, diseño de API.",
    },
    {
      name: "Mickael",
      role: "Desarrollador Full-stack",
      img: MickaelImg,
      desc: "Desarrollo frontend con React + JavaScript, bases de datos (MySQL), modelo de datos y apoyo a backend.",
    },
  ];

  return (
    <div className="overflow-x-hidden">
      <AnimatedSection>
        <section className="relative flex items-center justify-center min-h-[500px] py-20 px-6 md:px-20 lg:px-40 bg-amber-50 overflow-hidden">
          {/* Logo de fondo centrado */}
          <img
            src={LogoFull}
            alt="ZeroFoodWaste Logo"
            className="absolute inset-0 m-auto w-2/4 opacity-10 md:opacity-90 object-contain pointer-events-none"
          />

          {/* Texto principal encima */}
        </section>
      </AnimatedSection>

      <AnimatedSection>
        <section className="container flex items-center justify-center mx-auto bg-green-100 py-20 px-6 md:px-20 lg:px-40 text-center">
          <div className="z-10 text-center max-w-2xl">
            <h1 className="text-5xl font-bold mb-6">
              Convertir el desperdicio de alimentos en seguridad alimentaria
            </h1>
            <p className="text-xl">
              Conectamos restaurantes con excedentes de comida con bancos de
              alimentos que sirven a comunidades necesitadas. Juntos, estamos
              reduciendo el desperdicio y combatiendo el hambre.
            </p>
          </div>
        </section>
      </AnimatedSection>

      {/* Cómo funciona */}
      <AnimatedSection>
        <section className="container mx-auto pt-12 text-center py-20 px-6 md:px-20 lg:px-40 bg-blue-50">
          <h2 className="text-3xl font-bold mb-4">
            Cómo Funciona ZeroFoodWaste
          </h2>
          <p className="text-lg px-8 md:px-40">
            Una plataforma sencilla que crea conexiones significativas entre
            donadores de alimentos y quienes más los necesitan.
          </p>
        </section>
      </AnimatedSection>

      {/* Cards principales */}
      <AnimatedSection>
        <div className="container mx-auto pt-12 flex flex-wrap md:flex-nowrap gap-6 px-4">
          {/* Card 1 */}
          <div className="bg-green-50 rounded-xl p-8 shadow-lg flex flex-col items-center text-center flex-1">
            <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
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
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Restaurantes Publican Comida
            </h3>
            <p className="text-gray-600">
              Los restaurantes publican excedentes de comida disponibles con
              horarios y cantidades para recoger.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-yellow-50 rounded-xl p-8 shadow-lg flex flex-col items-center text-center flex-1">
            <div className="w-12 h-12 bg-yellow-500 text-white rounded-full flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
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
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Bancos de Alimentos Conectan
            </h3>
            <p className="text-gray-600">
              Los bancos de alimentos revisan las donaciones disponibles y
              coordinan la recolección directamente con los restaurantes.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-blue-50 rounded-xl p-8 shadow-lg flex flex-col items-center text-center flex-1">
            <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
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
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Crece el Impacto
            </h3>
            <p className="text-gray-600">
              Cada donación reduce el desperdicio, alimenta comunidades y
              construye un futuro más sostenible.
            </p>
          </div>
        </div>
      </AnimatedSection>

      {/* Únete a nuestra misión */}
      <AnimatedSection>
        <section className="container mx-auto my-16 bg-green-800 p-12 flex flex-col items-center text-center rounded-xl">
          <h3 className="text-3xl font-semibold text-white mb-4">
            Únete a nuestra misión
          </h3>
          <p className="text-lg text-white max-w-3xl">
            Ya sea que seas un restaurante que busca reducir el desperdicio o un
            banco de alimentos que necesita donaciones confiables, WeFoodWaste
            facilita marcar la diferencia.
          </p>
          <div className="flex gap-4 mt-8 flex-wrap justify-center">
            <button className="text-white bg-orange-500 rounded h-12 w-52 hover:ring-2 ring-orange-700 transition">
              Para restaurantes
            </button>
            <button className="text-green-800 bg-white rounded h-12 w-52 hover:ring-2 ring-white transition">
              Para Bancos alimenticios
            </button>
          </div>
        </section>
      </AnimatedSection>

      {/* El equipo */}
      <AnimatedSection>
        <section className="container mx-auto bg-gray-100 py-12 text-center">
          <h3 className="text-3xl font-bold mb-4">El Equipo</h3>
          <p className="text-lg mb-8 px-8 md:px-40">
            Somos un grupo apasionado dedicado a reducir el desperdicio de
            alimentos y la inseguridad alimentaria mediante la tecnología y la
            comunidad.
          </p>

          <div className="flex flex-wrap justify-center gap-6 px-4">
            {teamMembers.map((member) => (
              <div
                key={member.name}
                className="w-full sm:w-1/2 md:w-1/4 bg-white rounded-lg shadow-lg py-8 flex flex-col items-center text-center"
              >
                <div className="w-28 h-28 rounded-full overflow-hidden mb-4">
                  <img
                    src={member.img}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-lg font-medium text-gray-900">
                  {member.name}
                </h3>
                <p className="text-sm mt-1">{member.role}</p>
                <p className="text-sm text-gray-600 mt-3 px-2">{member.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </AnimatedSection>
    </div>
  );
};
