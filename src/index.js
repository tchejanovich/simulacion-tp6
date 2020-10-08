// Constantes
const HV = 99999999999;
const TF = 1000;

// Variables de control
const N = 10; // Puestos de atencion
const M = 500; // Metros cuadrados del local
const D = 1; // Metros cuadrados por persona

const getNroAleatorioEnRango = (min, max) =>
  Math.round(Math.random() * (max - min) + min);

const gaussianRand = () => {
  var rand = 0;

  for (var i = 0; i < 6; i += 1) {
    rand += Math.random();
  }

  return rand / 6;
};

const gaussianRandom = (start, end) => {
  return Math.floor(start + gaussianRand() * (end - start + 1));
};

// Funciones de probabilidad
const IA_EXTREMO_IZQUIERDO = 9;
const IA_EXTREMO_DERECHO = 12;
const getIA = () =>
  getNroAleatorioEnRango(IA_EXTREMO_IZQUIERDO, IA_EXTREMO_DERECHO); // En minutos

const TA_EXTREMO_IZQUIERDO = 15;
const TA_EXTREMO_DERECHO = 35;
// const getTA = () =>
//   getNroAleatorioEnRango(TA_EXTREMO_IZQUIERDO, TA_EXTREMO_DERECHO); // En minutos
const getTA = () => gaussianRandom(TA_EXTREMO_IZQUIERDO, TA_EXTREMO_DERECHO); // En minutos

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
let ITO = arrayNElementos(0);
let STO = arrayNElementos(0);

const getMinTPs = () =>
  TPS.reduce(
    (resultadoActual, tiempoI, i) => {
      const [menorValor] = resultadoActual;
      return tiempoI < menorValor ? [tiempoI, i] : resultadoActual;
    },
    [HV, -1]
  );

const getRandomDeArray = (array) =>
  array[Math.floor(Math.random() * array.length)];

const getVendedoresLibres = () =>
  TPS.map((valor, index) => (valor === HV ? index : null)).filter(
    (tps) => tps !== null
  );

const getVendedorLibre = () => {
  const vendedoresLibres = TPS.map((valor, index) =>
    valor === HV ? index : null
  ).filter((tps) => tps !== null);
  const vendedorLibre = getRandomDeArray(vendedoresLibres);
  console.log("vendedorLibre", vendedorLibre);
  return vendedorLibre;
};

const ocuparVendedorLibre = (tSalida) => {
  const iPuestoLibre = getVendedorLibre();
  TPS[iPuestoLibre] = tSalida;
  console.log("TPS", TPS);
  return iPuestoLibre;
};

const mostrarConPorcentaje = (valorDecimal) =>
  `${valorDecimal.toString().substring(0, 5)}%`;

const mostrarResultados = () => {
  let deltaRestar = 0;
  const minTime = Math.min.apply(Math, TPS);
  TPS.forEach((valor) => {
    if (valor !== HV) {
      deltaRestar = deltaRestar + (valor - minTime);
    }
  });
  STA = STA - deltaRestar;

  // Calculo de resultados
  ITO.forEach((valor, i) => {
    if (valor !== null) {
      STO[i] = STO[i] + T - ITO[i];
    }
  });

  const PP = (SS - SLL) / NT; // Promedio de permanencia
  const PE = (SS - SLL - STA) / NT; // Promedio de espera
  const PTO = STO.map((valor) => mostrarConPorcentaje((valor * 100) / T)); // Sumatoria de tiempo oscioso
  const PA = (ARR * 100) / (ARR + NT); // Sumatoria de tiempo oscioso

  console.log("T", T);
  console.log("STO", STO);
  console.log("SS", SS);
  console.log("SLL", SLL);
  console.log("STA", STA);
  console.log("Delta", SS - SLL - STA);
  console.log("NT", NT);

  console.log("-----------------------------------");
  console.log("PP", PP);
  console.log("PE", PE);
  console.log("PTO", PTO);
  console.log("PA", mostrarConPorcentaje(PA));
};

const personasEnLaCola = () => NS - Math.min(N, MAX_CLIENTES_ADENTRO);
const iteracion = () => {
  let [MinTPS, i] = getMinTPs();

  if (TPLL < MinTPS) {
    console.log("Tiempo", TPLL);
    console.log("Llegada!");
    // Llegada
    const IA = getIA();
    console.log("Intervalo entre arribos", IA);

    T = TPLL;
    TPLL = T + IA < TF ? T + IA : HV;

    const nuevoElementoEnSistema = () => {
      NT = NT + 1;
      console.log("NT", NT);
      console.log("nuevoElementoEnSistema!");
      NS = NS + 1;
      console.log("NS", NS);
      SLL = SLL + T;
      console.log("SLL", SLL);

      if (NS <= N && N + NS <= MAX_PERSONAS) {
        const TA = getTA();
        console.log("Tiempo de atencion", TA);
        const i = ocuparVendedorLibre(T + TA);
        console.log("P", P);
        STA = STA + TA;
        console.log("STA", STA);
        P = P + 1;
        console.log("P", P);
        console.log("Fin de tiempo oscioso vendedor", i + 1);
        console.log("Sumatoria de  oscioso vendedor " + (i + 1), T - ITO[i]);

        STO[i] = STO[i] + T - ITO[i];
        ITO[i] = null;
        console.log("STO", STO);
      } else {
        console.log("A la cola!");
        console.log("Total en cola:", personasEnLaCola());
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
    SS = SS + T;

    console.log("SS", SS);

    if (T < TF) {
      ITO[i] = T;
      TPS[i] = HV;
      console.log("TPS", TPS);
      console.log("personasEnLaCola", personasEnLaCola() + 1);
      if (personasEnLaCola() + 1 > 0) {
        const TA = getTA();
        console.log("Tiempo de atencion", TA);
        i = getVendedorLibre();
        STO[i] = STO[i] + T - ITO[i];
        console.log("Fin de tiempo oscioso vendedor", i + 1);
        TPS[i] = T + TA;
        console.log("TPS", TPS);
        STA = STA + TA;
        console.log("STA", STA);
      }
    } else {
      ITO[i] = null;
    }
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
