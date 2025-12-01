import type { ReactElement, ReactNode } from "react";
import "./errorPage.css";

export const ErrorPage = () : ReactNode => {
  return(
    <>
      <div className="error-container">
        <h1 className="error-title">404</h1>
        <p className="error-message">Oops! The page you're looking for doesn't exist.</p>
        <a className="error-link" href="/">Go Back Home</a>
      </div>
    </>
  )
}