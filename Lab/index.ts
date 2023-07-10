import { Grafo } from "./grafo";
import { Main } from "./main";

const main: Main = new Main();

console.log("========================");
console.log("==== Grafo Completo ====");
console.log("========================");

const grafoCompleto = main.generateCompleteGrafo(5, "vC");

main.printGrafo("matriz", grafoCompleto);

console.log("\n\n===========================");
console.log("===== Grafo K-Regular =====");
console.log("===========================");

const grafoKRegular = main.generateKOrderGrafo(4, 3, "vK");

main.printGrafo("adjascente", grafoKRegular);

console.log("\n\n============================");
console.log("===== Grafo Bi-Partido =====");
console.log("============================");

const v0 = new Grafo(0, "vB0");
const v1 = new Grafo(1, "vB1");
const v2 = new Grafo(2, "vB2");
const v3 = new Grafo(3, "vB3");
const v4 = new Grafo(4, "vB4");
const v5 = new Grafo(5, "vB5");

v0.addArestaBidirecional(v1);
v0.addArestaBidirecional(v2);
v0.addArestaBidirecional(v3);
v0.addArestaBidirecional(v4);
v0.addArestaBidirecional(v5);

const conjuntoX: Grafo[] =  [v1, v2, v3, v4, v5];
const conjuntoXNames = conjuntoX.map((grafo) => grafo.getName());

const conjuntoY: Grafo[] = [v0];
const conjuntoYNames = conjuntoY.map((grafo) => grafo.getName());

const isBiPartido: boolean = main.isBiPartido(conjuntoX, conjuntoY);

console.log(
  `O conjunto de vértices ${conjuntoXNames.join(
    ", "
  )} e o conjunto de vértices ${conjuntoYNames.join(", ")}${
    isBiPartido ? "" : " não"
  } são Bi-Partidos`
);
