import { Dispatch, SetStateAction, createContext, useContext } from "react";

import { Grafo } from "@/model/Grafo";
import { IUserEdge, IUserNode } from "@antv/graphin";
import { useEffect, useState } from "react";
import { initialGraph } from "@/constants/initial-graph";

const formmatedNodes = (grafos: Grafo[]): IUserNode[] => {
  return grafos.map((vertice) => {
    return {
      id: vertice.getIndice().toString(),
      style: {
        label: {
          value: vertice.getName(),
        },
        keyshape: {
          fill: "#6096BA",
          stroke: "#6096BA",
          fillOpacity: 0.3,
          size: 30,
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
        target: aresta.getTarget().getIndice().toString(),
        weight: aresta.getPeso(),
        style: {
          label: {
            value: aresta.getName()
          },
          keyshape: {
            opacity: 0.3,
            stroke: "#001529",
          },
        },
      };
    });
  });
};

type Props = {
  children?: React.ReactNode;
};

const Context = createContext<IGrafosContext>({} as IGrafosContext);

interface IGrafosContext {
  nodes: IUserNode[];
  edges: IUserEdge[];
  grafos: Grafo[];
  handleUpdateGrafo: () => void;
}

export const GrafoContext = ({ children }: Props) => {
  const [grafos, setGrafos] = useState<Grafo[]>(initialGraph);
  const [nodes, setNodes] = useState<IUserNode[]>(formmatedNodes(grafos));
  const [edges, setEdges] = useState<IUserEdge[]>(formmatedEdges(grafos));

  const handleUpdateGrafo = () => {
    setGrafos([...grafos]);
  };

  useEffect(() => {
    setNodes(formmatedNodes(grafos));
    setEdges(formmatedEdges(grafos));
  }, [grafos]);

  return (
    <Context.Provider
      value={{
        edges,
        grafos,
        handleUpdateGrafo,
        nodes,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useGrafos = () => {
  return useContext(Context);
};
