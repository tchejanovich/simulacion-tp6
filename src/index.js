// Constantes
const HV = 99999999999;
const TF = 2000;

// Variables de control
const N = 3; // Puestos de atencion
const M = 5000; // Metros cuadrados del local
const D = 1; // Metros cuadrados por persona

const getNroAleatorioEnRango = (min, max) =>
  Math.round(Math.random() * (max - min) + min);

// Funciones de probabilidad
const IA_EXTREMO_IZQUIERDO = 9;
const IA_EXTREMO_DERECHO = 12;
const getIA = () =>
  getNroAleatorioEnRango(IA_EXTREMO_IZQUIERDO, IA_EXTREMO_DERECHO); // En minutos

const TA_EXTREMO_IZQUIERDO = 10;
const TA_EXTREMO_DERECHO = 50;
const getTA = () =>
  getNroAleatorioEnRango(TA_EXTREMO_IZQUIERDO, TA_EXTREMO_DERECHO); // En minutos
const getR = Math.random;

// Auxiliares
const arrayNElementos = (valor) => [...Array(N).keys()].map(() => valor);
const MAX_PERSONAS = Math.floor(M / D); // Cantidad maxima de personas
const MAX_CLIENTES_ADENTRO = MAX_PERSONAS - N;
console.log("MAX_PERSONAS", MAX_PERSONAS);
console.log("MAX_CLIENTES_ADENTRO", MAX_CLIENTES_ADENTRO);

// Variables
let T = 0;
let TPLL = 0;
let TPS = arrayNElementos(HV);
let NS = 0;
let NT = 0;
let SLL = 0;
let SS = 0;
let STA = 0;
let ARR = 0;
let P = 0;
let ITO = arrayNElementos(null);
let STO = arrayNElementos(0);

const getMinTPs = () =>
  TPS.reduce(
    (resultadoActual, tiempoI, i) => {
      const [menorValor] = resultadoActual;
      return tiempoI < menorValor ? [tiempoI, i] : resultadoActual;
    },
    [HV, -1]
  );

const getPuestoLibre = () => TPS.findIndex((tps) => tps === HV);
const ocuparPuestoLibre = (tSalida) => {
  const iPuestoLibre = getPuestoLibre();
  TPS[iPuestoLibre] = tSalida;
  console.log("TPS", TPS);
  return iPuestoLibre;
};

const mostrarConPorcentaje = (valorDecimal) =>
  `${valorDecimal.toString().substring(0, 5)}%`;

const mostrarResultados = () => {
  // Calculo de resultados
  ITO.forEach((valor, i) => {
    if (valor === null) {
      // STO[i] = STO[i] + T - ITO[i];
    }
  });

  const PP = (SS - SLL) / NT; // Promedio de permanencia
  const PE = (SS - SLL - STA) / NT; // Promedio de espera
  const PTO = STO.map((valor) => mostrarConPorcentaje((valor * 100) / T)); // Sumatoria de tiempo oscioso
  const PA = (ARR * 100) / NT; // Sumatoria de tiempo oscioso

  console.log("T", T);
  console.log("STO", STO);
  console.log("SS", SS);
  console.log("SLL", SLL);
  console.log("-----------------------------------");
  console.log("PP", PP);
  console.log("PE", PE);
  console.log("PTO", PTO);
  console.log("PA", mostrarConPorcentaje(PA));
};

const iteracion = () => {
  const [MinTPS, i] = getMinTPs();

  if (TPLL < MinTPS) {
    console.log("Tiempo", TPLL);
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

      if (NS <= N && N + NS <= MAX_PERSONAS) {
        const TA = getTA();
        console.log("Tiempo de atencion", TA);
        const i = ocuparPuestoLibre(T + TA);
        console.log("P", P);
        STA = STA + TA;
        P = P + 1;
        console.log("P", P);
        console.log("Fin de tiempo oscioso vendedor", i + 1);
        console.log("Sumatoria de  oscioso vendedor " + (i + 1), T - ITO[i]);
        STO[i] = STO[i] + T - ITO[i];
        console.log("STO", STO);
      } else {
        console.log("A la cola!");
        // console.log("Total en cola:", NS - MAX_CLIENTES_ADENTRO      );
      }
    };

    if (NS <= N + 3) {
      nuevoElementoEnSistema();
    } else {
      const R = getR();
      console.log("R aleatorio", R);
      if (NS < N + 6 && R > 0.4) {
        nuevoElementoEnSistema();
      } else {
        console.log("Arrepentimiento!");
        ARR = ARR + 1;
        console.log("ARR", ARR);
      }
    }
  } else {
    console.log("Tiempo", MinTPS);
    console.log("Salida!");
    console.log("Vendedor libre", i);

    // Salida
    T = MinTPS;
    NS = NS - 1;
    console.log("NS", NS);

    if (T < TF) {
      if (NS < N) {
        console.log("Inicio de tiempo oscioso vendedor", i + 1);
        ITO[i] = T;

        TPS[i] = HV;
        console.log("TPS", TPS);
      } else {
        const TA = getTA();
        console.log("Tiempo de atencion", TA);
        TPS[i] = T + TA;
        console.log("TPS", TPS);
        STA = STA + TA;
        console.log("STO", STO);
      }
    }
    SS = SS + T;
  }

  const loggear = () => {
    console.log("-----------------------------------");
    console.log("-----------------------------------");
    console.log("-----------------------------------");
    console.log("-----------------------------------");
  };

  if (T < TF) {
    loggear();
    iteracion();
  } else {
    if (NS > 0) {
      console.log("Tiempo final alcanzado. Vaciando");
      TPLL = HV;
      loggear();
      iteracion();
    } else {
      // Fin simulacion
      console.log("Local cerrado, Mostrando resultados");
      loggear();

      mostrarResultados();
    }
  }
};
iteracion();

// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById('root')
// );
