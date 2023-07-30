import { Grafo } from "./grafo";
import { Main } from "./main";

const main: Main = new Main();

const uV = new Grafo(0, "u");
const yV = new Grafo(1, "y");
const vV = new Grafo(2, "v");
const xV = new Grafo(3, "x");
const wV = new Grafo(4, "w");

uV.addArestaBidirecional(vV);
uV.addArestaBidirecional(yV);

yV.addArestaBidirecional(vV);
yV.addArestaBidirecional(vV);
yV.addArestaBidirecional(wV);
yV.addArestaBidirecional(xV);

vV.addArestaBidirecional(wV);

xV.addArestaBidirecional(wV);

const grafos = [xV, yV, vV, wV, uV];

type edge = [source: number, target: number];

const aE1: edge = [uV.getIndice(), vV.getIndice()];
const aE2: edge = [vV.getIndice(), uV.getIndice()];

const bE1: edge = [wV.getIndice(), vV.getIndice()];
const bE2: edge = [vV.getIndice(), wV.getIndice()];

const cE1: edge = [xV.getIndice(), wV.getIndice()];
const cE2: edge = [wV.getIndice(), xV.getIndice()];

const dE1: edge = [xV.getIndice(), yV.getIndice()];
const dE2: edge = [yV.getIndice(), xV.getIndice()];

const eE1: edge = [uV.getIndice(), yV.getIndice()];
const eE2: edge = [yV.getIndice(), uV.getIndice()];

const fE1: edge = [yV.getIndice(), vV.getIndice()];
const fE2: edge = [vV.getIndice(), yV.getIndice()];

const gE1: edge = [yV.getIndice(), vV.getIndice()];
const gE2: edge = [vV.getIndice(), yV.getIndice()];

const hE1: edge = [yV.getIndice(), wV.getIndice()];
const hE2: edge = [wV.getIndice(), yV.getIndice()];

const subGrafo1 = main.getSubGrafo({
  grafos,
  arestas: [aE1, aE2, eE1, eE2, fE1, fE2, gE1, gE2],
  vertices: [uV.getIndice(), vV.getIndice(), yV.getIndice()],
});

console.log("==============================");
console.log("=======SUBGRAFO PROPRIO=======");
console.log("==============================");

main.printGrafo("adjascente", subGrafo1);

const subGrafo2 = main.getSubGrafo({
  grafos,
  arestas: [eE1, eE2, fE1, fE2, gE1, gE2],
  vertices: [uV.getIndice(), vV.getIndice(), yV.getIndice()],
});

console.log("==============================");
console.log("=======SUBGRAFO GERADOR=======");
console.log("==============================");

main.printGrafo("adjascente", subGrafo2);

const X1 = [yV.getIndice(), vV.getIndice(), xV.getIndice(), uV.getIndice()];

const subGrafo3 = main.getSubGrafo(
  {
    grafos,
    arestas: [],
    vertices: X1,
  },
  "vertice"
);

console.log("==============================");
console.log("=====SUBGRAFO INDUZIDO X1=====");
console.log("==============================");

main.printGrafo("adjascente", subGrafo3);

const X2 = [uV.getIndice(), wV.getIndice()];

const subGrafo4 = main.getSubtractGrafo(
  {
    grafos,
    arestas: [],
    vertices: X2,
  },
  "vertice"
);

console.log("==============================");
console.log("=========SUBTRACAO X2=========");
console.log("==============================");

main.printGrafo("adjascente", subGrafo4);

const E1 = [aE1, aE2, cE1, cE2, eE1, eE2, gE1, gE2];

const subGrafo5 = main.getSubGrafo(
  {
    grafos,
    arestas: E1,
    vertices: [],
  },
  "aresta"
);

console.log("==============================");
console.log("==========SUBGRAFO E1=========");
console.log("==============================");

main.printGrafo("adjascente", subGrafo5);

const E2 = [aE1, aE2, bE1, bE2, fE1, fE2];

const subGrafo6 = main.getSubtractGrafo(
  {
    grafos,
    arestas: E2,
    vertices: [],
  },
  "aresta"
);

console.log("==============================");
console.log("=========SUBTRACAO E2=========");
console.log("==============================");

main.printGrafo("adjascente", subGrafo6);
