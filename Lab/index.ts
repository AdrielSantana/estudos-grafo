import { Grafo } from "./grafo";
import { Main } from "./main";

const main: Main = new Main();

const v1 = new Grafo(1, "v1");
const v2 = new Grafo(2, "v2");
const v3 = new Grafo(3, "v3");
const v4 = new Grafo(4, "v4");
const v5 = new Grafo(5, "v5");
const v6 = new Grafo(6, "v6");
const v7 = new Grafo(7, "v7");
const v8 = new Grafo(8, "v8");
const v9 = new Grafo(9, "v9");
const v10 = new Grafo(10, "v10");
const v11 = new Grafo(11, "v11");

v1.addArestaBidirecional(v2);
v1.addArestaBidirecional(v3);
v1.addArestaBidirecional(v4);

v2.addArestaBidirecional(v5);
v2.addArestaBidirecional(v6);

v3.addArestaBidirecional(v7);
v3.addArestaBidirecional(v8);

v4.addArestaBidirecional(v9);

v6.addArestaBidirecional(v10);

v8.addArestaBidirecional(v11);

const depthSearch = main.depthSearch(v1);

const formmatNodes = depthSearch.map((node) => {
  return node.getName();
});

console.log(
  `A busca por profundidade passou pelo(s) vertice(s) ${formmatNodes.join(
    ", "
  )}.`
);
