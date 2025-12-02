import type { ReactElement, ReactNode } from "react";

export const Home = () : ReactNode => {
  return (
    <>
      <section className="min-h-80 py-20 px-8 md:px-40 lg:px-80 bg-green-100">
        <h1 className="text-center font-bold text-5xl mb-4">
          Convertir el desperdicio de alimentos en seguridad alimentaria
        </h1>
        <p className="text-center text-xl lg:px-12">
          Conectamos restaurantes con excedentes de comida con bancos de alimentos que sirven a comunidades necesitadas. Juntos, estamos reduciendo el desperdicio y combatiendo el hambre.
        </p>
      </section>
      <section className="container mx-auto pt-8">
        <h2 className="text-center text-3xl font-bold mb-4">
          Como Funciona ZeroFoodWaste
        </h2>
        <p className="text-center text-lg px-8">
          Una plataforma sencilla que crea conexiones significativas entre donadores de alimentos y quienes más los necesitan.
        </p>
      </section>

      <div className="container mx-auto pt-8 flex flex-wrap md:flex-nowrap gap-4">
        <article className="bg-green-50 rounded-xl p-8 shadow-sm flex flex-col items-center">
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
          <p className="text-gray-600 text-center">
            Los restaurantes publican excedentes de comida disponibles con horarios y cantidades para recoger.
          </p>
        </article>

        <article className="bg-yellow-50 rounded-xl p-8 shadow-sm flex flex-col items-center">
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
          <p className="text-gray-600 text-center">
            Los bancos de alimentos revisan las donaciones disponibles y coordinan la recolección directamente con los restaurantes.
          </p>
        </article>

        <article className="bg-blue-50 rounded-xl p-8 shadow-sm flex flex-col items-center">
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
          <p className="text-gray-600 text-center">
            Cada donación reduce el desperdicio, alimenta comunidades y construye un futuro más sostenible.
          </p>
        </article>
      </div>

      <section className="container mx-auto my-8 bg-green-800 p-8 flex flex-col items-center xl:px-80">
        <h3 className="text-2xl text-center font-semibold text-white">
          Únete a nuestra misión
        </h3>
        <p className="text-lg text-center text-white mt-6">Ya sea que seas un restaurante que busca reducir el desperdicio o un banco de alimentos que necesita donaciones confiables, WeFoodWaste facilita marcar la diferencia.</p>
        <div className="flex gap-4 mt-6">
          <button className="text-white bg-orange-500 rounded h-12 w-52 hover:ring-2 ring-orange-700">Para restaurantes</button>
          <button className="text-green-800 bg-white rounded h-12 w-52 hover:ring-2 ring-white">Para Bancos alimenticios</button>
        </div>
      </section>

      <section className="container mx-auto">
        <h3 className="text-center text-3xl font-bold mb-4">
          El Equipo
        </h3>
      </section>
    </>
  )
}