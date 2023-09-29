import { Grafo } from "@/model/Grafo";
import { Main } from "@/model/Main";

const vertice0 = new Grafo(0, "v0");
const vertice1 = new Grafo(1, "v1");
const vertice2 = new Grafo(2, "v2");
const vertice3 = new Grafo(3, "v3");
const vertice4 = new Grafo(4, "v4");

const main = new Main()

export const initialGraph = [vertice0, vertice1, vertice2, vertice3, vertice4];

main.addRandomArestas(initialGraph)