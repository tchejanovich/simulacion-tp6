import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import moment from "moment";

// Constantes
const DURACION_SIMULACION = 1000; // En minutos
const DURACION_MINUTO = 1000; // En milesimas de segundo. Reducido para simular
const TIEMPO_INICIO = moment();
const TIEMPO_FIN = moment(TIEMPO_INICIO).add(DURACION_SIMULACION, "minutes");
const HV = 99999999999;
const HVT = moment(TIEMPO_INICIO).add(100, "year");

const TF = 1000;

// Variables de control
const N = 3; // Puestos de atencion
const M = 100; // Metros cuadrados del local
const D = M / N; // Metros cuadrados por persona

// Funciones de probabilidad
const getIA = () => 10; // En minutos
const getTA = () => 20; // En minutos
const getR = () => 0.5;

const arrayNElementos = (valor) => [...Array(N).keys()].map(() => valor);

// Variables
let T = 0;
let TPLL = 0;
let TPS = arrayNElementos(HV);
let NS = 0;
let NT = 0;
let SLL = 0;
let STA = 0;
let ARR = 0;
let P = 0;
let ocupaciones = arrayNElementos(false);

const getMinTPs = () =>
  TPS.reduce(
    (resultadoActual, tiempoI, i) => {
      const [menorValor] = resultadoActual;
      return tiempoI < menorValor ? [tiempoI, i] : resultadoActual;
    },
    [HV, -1]
  );

const getNroPuestoLibre = () => ocupaciones.findIndex((ocupado) => !ocupado);

const iteracion = () => {
  console.log("T", T);
  const [MinTPS, IMinTPS] = getMinTPs();
  if (TPLL < MinTPS) {
    console.log("Llegada!");
    // Llegada
    const IA = getIA();
    console.log("Intervalo entre arribos", IA);

    T = TPLL;
    TPLL = T + IA;
    console.log("TPLL", TPLL);
    NT = NT + 1;
    console.log("NT", NT);

    const nuevoElementoEnSistema = () => {
      console.log("nuevoElementoEnSistema!");
      NS = NS + 1;
      console.log("NS", NS);
      SLL = SLL + T;

      if (NS <= N) {
        const TA = getTA();
        console.log("Tiempo de atencion", TA);
        const nroPuestoLibre = getNroPuestoLibre();
        ocupaciones[nroPuestoLibre] = true;
        console.log("ocupaciones", ocupaciones);
        TPS[nroPuestoLibre] = T + TA;
        console.log("TPS", TPS);
        STA = STA + TA;
        P = P + 1;
        console.log("P", P);
      } else {
        console.log("En cola");
      }
    };

    if (NS <= N + 3) {
      nuevoElementoEnSistema();
    } else {
      const R = getR();
      if (NS < N + 6 && R > 0.4) {
        nuevoElementoEnSistema();
      } else {
        console.log("Arrepentimiento!");
        ARR = ARR + 1;
        console.log("ARR", ARR);
      }
    }
  } else {
    console.log("Salida!");
    console.log("Vendedor libre", IMinTPS);
    // Salida
    T = MinTPS;
    NS = NS - 1;
    console.log("NS", NS);

    if (NS < N) {
      // ITO(i) = T
      TPS[IMinTPS] = HV;
      console.log("TPS", TPS);
      ocupaciones[IMinTPS] = false;
      console.log("ocupaciones", ocupaciones);
    } else {
      const TA = getTA();
      console.log("Tiempo de atencion", TA);
      const nroPuestoLibre = getNroPuestoLibre();

      TPS[nroPuestoLibre] = T + TA;
      console.log("TPS", TPS);
      ocupaciones[nroPuestoLibre] = true;
      console.log("ocupaciones", ocupaciones);
      STA = STA + TA;
      // STO(i) = STO(i) + T - ITO(i)
    }
    // SS = SS + T
  }

  const loggear = () => {
    // console.log("T", T);
    // console.log("TPLL", TPLL);
    // console.log("TPS", TPS);
    // console.log("NS", NS);
    // console.log("NT", NT);
    console.log("-----------------------------------");
    console.log("-----------------------------------");
    console.log("-----------------------------------");
    console.log("-----------------------------------");
  };

  if (T < TF) {
    loggear();
    iteracion();
  } else {
    // Fin simulacion
    console.log("Terminado!");
    loggear();
  }
};
iteracion();

// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById('root')
// );
