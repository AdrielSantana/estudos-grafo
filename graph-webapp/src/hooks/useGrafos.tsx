import { Grafo } from "@/hooks/Grafo";
import { IUserEdge, IUserNode } from "@antv/graphin";
import { useEffect, useMemo, useState } from "react";

const vertice0 = new Grafo(0, "v0");
const vertice1 = new Grafo(1, "v1");
const vertice2 = new Grafo(2, "v2");
const vertice3 = new Grafo(3, "v3");
const vertice4 = new Grafo(4, "v4");
const vertice5 = new Grafo(5, "v5");

const vertices = [vertice0, vertice1, vertice2, vertice3, vertice4, vertice5];

export const useGrafos = () => {
  const [grafos, setGrafos] = useState<Grafo[]>(vertices);
  const [nodes, setNodes] = useState<IUserNode[]>();
  const [edges, setEdges] = useState<IUserEdge[]>();

  useEffect(() => {
    setNodes(formmatedNodes(grafos));
    setEdges(formmatedEdges(grafos));
  }, [grafos]);

  const formmatedNodes = (grafos: Grafo[]): IUserNode[] => {
    return grafos.map((vertice) => {
      return {
        id: vertice.getIndice().toString(),
        style: {
          label: {
            value: vertice.getName(),
          },
        },
      };
    });
  };

  const formmatedEdges = (grafos: Grafo[]): IUserEdge[] => {
    return grafos.flatMap((vertice) => {
      return vertice.getArestasAdj().map((aresta) => {
        return {
          source: vertice.getIndice().toString(),
          target: aresta.getIndice().toString(),
        };
      });
    });
  };

  return { nodes, edges, grafos, setGrafos };
};
