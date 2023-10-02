import { Grafo } from "@/model/Grafo";
import { Main } from "@/model/Main";
import { buildings } from "./data/buildings";

const grafos: Grafo[] = [];

buildings.features.forEach((feature, index) => {
  if (feature.properties.name) {
    grafos.push(new Grafo(index, feature.properties.name));
  }
});

const main = new Main();

main.addRandomArestas(grafos);

export const initialGraph = grafos;
