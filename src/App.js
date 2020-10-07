import React, { useEffect, useState } from "react";
import moment from "moment";

import logo from "./logo.svg";
import "./App.css";
import { scryRenderedDOMComponentsWithTag } from "react-dom/test-utils";

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

const App = () => {
  // Variables
  const [hookT, setT] = useState(0);
  const [hookTPLL, setTPLL] = useState(0);
  const [hookTPS, setTPS] = useState(arrayNElementos(HV));
  const [hookNS, setNS] = useState(0);
  const [hookNT, setNT] = useState(0);
  const [hookSLL, setSLL] = useState(0);
  const [hookSTA, setSta] = useState(0);
  const [hookARR, setARR] = useState(0);
  const [hookP, setP] = useState(0);
  const [hookOcupaciones, setOcupaciones] = useState(arrayNElementos(false));

  // Funciones auxiliares
  // const ocupacionSet = (i, valor) => {
  //   const ocupacionesActuales = [...ocupaciones];
  //   ocupacionesActuales[i] = valor;
  //   setOcupaciones(ocupacionesActuales);
  // };

  // const TPSSet = (i, valor) => {
  //   const TPSActuales = [...TPS];
  //   TPSActuales[i] = valor;
  //   setTPS(TPSActuales);
  // };

  const agregarMinutos = (fecha, cantidadMinutos) =>
    moment(fecha).add(cantidadMinutos, "minutes");

  useEffect(() => {
    const iteracion = () => {
      // Variables
      let T = hookT;
      let TPLL = hookTPLL;
      let TPS = hookTPS;
      let NS = hookNS;
      let NT = hookNT;
      let SLL = hookSLL;
      let STA = hookSTA;
      let ARR = hookARR;
      let P = hookP;
      let ocupaciones = hookOcupaciones;

      const getMinTPs = () =>
        TPS.reduce(
          (resultadoActual, tiempoI, i) => {
            const [menorValor] = resultadoActual;
            return tiempoI < menorValor ? [tiempoI, i] : resultadoActual;
          },
          [HV, -1]
        );

      const getNroPuestoLibre = () =>
        ocupaciones.findIndex((ocupado) => !ocupado);

      const [MinTPS, IMinTPS] = getMinTPs();
      if (TPLL < MinTPS) {
        console.log("Llegada!");
        // Llegada
        const IA = getIA();

        T = TPLL;
        TPLL = T + IA;
        NT = NT + 1;

        const nuevoElementoEnSistema = () => {
          NS = NS + 1;
          SLL = SLL + T;

          if (NS <= N) {
            const TA = getTA();
            const nroPuestoLibre = getNroPuestoLibre();
            TPS[nroPuestoLibre] = T + TA;
            STA = STA + TA;
            P = P + 1;
          }
        };

        if (NS <= N + 3) {
          nuevoElementoEnSistema();
        } else {
          const R = getR();
          if (NS < N + 6 && R > 0.4) {
            nuevoElementoEnSistema();
          } else {
            ARR = ARR + 1;
          }
        }
      } else {
        console.log("Salida!");
        // Salida
        T = MinTPS;
        NS = NS - 1;
        if (NS < N) {
          // ITO(i) = T
          TPS[IMinTPS] = HV;
        } else {
          const TA = getTA();
          const nroPuestoLibre = getNroPuestoLibre();

          TPS[nroPuestoLibre] = T + TA;
          STA = STA + TA;
          // STO(i) = STO(i) + T - ITO(i)
        }
        // SS = SS + T
      }

      const setearHooks = () => {
        console.log("T", T);
        console.log("TPLL", TPLL);
        console.log("TPS", TPS);
        console.log("NS", NS);
        console.log("NT", NT);
        // setT(T);
        // setTPLL(TPLL);
        // setTPS(TPS);
        // setNS(NS);
        // setNT(NT);
      };

      if (T < TF) {
        setearHooks();
        iteracion();
      } else {
        // Fin simulacion
        console.log("Terminado!");
        // setearHooks();
      }
    };
    iteracion();
  }, []);

  // const [sim1, setSim1] = useState(true);
  // const [sim2, setSim2] = useState(false);
  // const [contador, setContador] = useState(100);

  // useState(() => {
  //   console.log("contador > 0", contador > 0);
  //   console.log("sim1", sim1);
  //   console.log("sim2", sim2);
  //   if (contador > 0 && (sim1 || sim2)) {
  //     console.log("Simulando!", contador);
  //     setSim1(!sim1);
  //     setSim2(!sim2);
  //     setContador(contador - 1);
  //   }
  // }, [sim1, sim2, contador]);

  // Reloj
  // useEffect(() => {
  //   // Fin de la simulacion
  //   if (T >= TIEMPO_FIN) {
  //     alert("Fin!");
  //     return;
  //   }

  //   const proximoT = moment(T).add(1, "minutes");
  //   const timeout = setTimeout(() => setT(proximoT), DURACION_MINUTO);

  //   return () => {
  //     clearTimeout(timeout);
  //   };
  // }, [T, setT]);

  // Flujo
  // useEffect(() => {
  //   return;
  //   let t = T;
  //   console.log("Inicio!");
  //   const [MinTPS, IMinTPS] = getMinTPs();

  //   // If principal
  //   if (TPLL < MinTPS) {
  //     // Llegada
  //     const IA = getIA();

  //     setT(TPLL);
  //     t = TPLL;
  //     setTPLL(agregarMinutos(t, IA));
  //     setNT(NT + 1);

  //     const entradaAlSistema = () => {
  //       setNS(NS + 1);
  //       // SLL = SLL + T
  //       if (NS <= N) {
  //         const nroPuestoLibre = getNroPuestoLibre();
  //         const TA = getTA();

  //         TPSSet(nroPuestoLibre, agregarMinutos(t, TA));
  //         // STA = STA + TA(i)
  //         // P= P + 1
  //       }
  //     };

  //     if (NS <= N + 3) {
  //       entradaAlSistema();
  //     } else {
  //       if (NS < N + 6) {
  //         const R = getR();
  //         if (R > 0.4) {
  //           entradaAlSistema();
  //         } else {
  //           // ARR = ARR +1
  //         }
  //       }
  //     }
  //   } else {
  //     // Salida
  //     t = MinTPS;
  //     setNS(NS - 1);
  //     if (NS < N) {
  //       // ITO(i) = T
  //       TPSSet(IMinTPS, HV);
  //     }
  //   }
  // }, []);

  // useEffect(() => {
  //   console.log("NS", NS);
  //   setNS("hola");
  //   console.log("NS", NS);
  // }, [NS]);

  return (
    <div style={{ padding: 100 }}>
      <p>T: {hookT.toString()}</p>
      <p>TPLL: {hookTPLL.toString()}</p>
      <p>TPS: [{hookTPS.map((tps) => `${tps.toString()}, `)}]</p>
      <p>NS: {hookNS.toString()}</p>
      <p>NT: {hookNT.toString()}</p>
    </div>
  );
};

export default App;

// const App = () => {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// };
