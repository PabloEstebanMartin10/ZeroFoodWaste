import type { ReactElement, ReactNode } from "react";
import "./home.css"

export const Home = () : ReactNode => {
  return (
    <>
      <section className="titleSection">
        <h1 className="titleSection__title">Convertir el desperdicio de alimentos en seguridad alimentaria</h1>
        <p className="titleSection__description">Conectamos restaurantes con excedentes de comida con bancos de alimentos que sirven a comunidades necesitadas. Juntos, estamos reduciendo el desperdicio y combatiendo el hambre.</p>
      </section>
    </>
  )
}