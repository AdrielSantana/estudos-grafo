import { Grafo } from "./grafo";
import { Main } from "./main";

const main: Main = new Main();

const v1 = new Grafo(1, "v1");
const v2 = new Grafo(2, "v2");
const v3 = new Grafo(3, "v3");
const v4 = new Grafo(4, "v4");
const v5 = new Grafo(5, "v5");

v1.addArestaBidirecional(v2);
v1.addArestaBidirecional(v5);

v2.addArestaBidirecional(v3);
v2.addArestaBidirecional(v4);
// v2.addArestaBidirecional(v5)

v3.addArestaBidirecional(v4);

// v4.addArestaBidirecional(v5)

const passeio: Grafo[] = [v1, v2, v3, v4, v2];

console.log("\nImprime o passeio");
main.printPasseio(passeio);

console.log("\nImprime o passeio reverso");
main.printReversePasseio(passeio);

const i = 1;
const j = 3;
console.log("\nImprime o segmento do passeio do índice " + i + " a " + j);
main.printPasseioSegment(passeio, i, j);

const depthPasseio = main.findPasseio(v1, v5);

console.log(
  "\nImprime o passeio encontrado por busca em profundidade do vértice " +
    v1.getName() +
    " ao vértice " +
    v5.getName()
);
main.printPasseio(depthPasseio);

const depthPasseio2 = main.findCaminho(v2, v4);

// console.log(
//   "\nImprime o caminho encontrado por busca em profundidade do vértice " +
//     v2.getName() +
//     " ao vértice " +
//     v4.getName()
// );

// main.printPasseio(depthPasseio2);
