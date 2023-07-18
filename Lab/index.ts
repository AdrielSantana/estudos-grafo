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
v1.addArestaBidirecional(v4);

v2.addArestaBidirecional(v5);
v2.addArestaBidirecional(v6);

v3.addArestaBidirecional(v7);
v3.addArestaBidirecional(v8);

v4.addArestaBidirecional(v9);

v6.addArestaBidirecional(v10);

v8.addArestaBidirecional(v11);

console.log("=============================");
console.log("=======    GRAFO 1    =======");
console.log("=============================");

const depthSearch1 = main.depthSearch(v1);

const formmatNodes1 = depthSearch1.map((node) => {
  return node.getName();
});

console.log(
  `\n\nA busca por profundidade passou pelo(s) vertice(s) ${formmatNodes1.join(
    ", "
  )}.\n\n`
);

const a = new Grafo(0, "a");
const b = new Grafo(1, "b");
const c = new Grafo(2, "c");
const d = new Grafo(3, "d");
const e = new Grafo(4, "e");
const f = new Grafo(5, "f");
const g = new Grafo(6, "g");
const h = new Grafo(7, "h");

a.addArestaBidirecional(b);
a.addArestaBidirecional(c);
a.addArestaBidirecional(e);
a.addArestaBidirecional(f);

b.addArestaBidirecional(d);
b.addArestaBidirecional(e);

c.addArestaBidirecional(f);
c.addArestaBidirecional(g);
c.addArestaBidirecional(h);

f.addArestaBidirecional(g);
f.addArestaBidirecional(h);

g.addArestaBidirecional(h);

console.log("=============================");
console.log("=======    GRAFO 2    =======");
console.log("=============================");

const depthSearch2 = main.depthSearch(a);

const formmatNodes2 = depthSearch2.map((node) => {
  return node.getName();
});

console.log(
  `\n\nA busca por profundidade passou pelo(s) vertice(s) ${formmatNodes2.join(
    ", "
  )}.\n\n`
);
