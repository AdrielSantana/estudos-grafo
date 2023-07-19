"use client";

import Graphin, { Behaviors, Utils } from "@antv/graphin";
import { useGrafos } from "@/hooks/useGrafos";
import { HandleGraph } from "./HandleGraph";
import { Grafo } from "@/model/Grafo";

const { ZoomCanvas, ActivateRelations } = Behaviors;

type Props = {
  layoutType: string;
  verticeName: string;
};

const GraphContainer = ({ verticeName, layoutType }: Props) => {
  const { edges, nodes, grafos, handleUpdateGrafo } = useGrafos();

  const proceededEdges = Utils.processEdges(edges, {
    poly: 30,
    loop: 6,
  });

  return (
    <Graphin
      containerId="Graphin"
      data={{ nodes, edges: proceededEdges }}
      layout={{ type: layoutType }}
      defaultNode={{
        // @ts-ignore
        style: {
          keyshape: {
            fill: "#6096BA",
            stroke: "#6096BA",
            fillOpacity: 0.3,
            size: 30,
          },
        },
      }}
      defaultEdge={{
        // @ts-ignore
        style: {
          keyshape: {
            opacity: 0.3,
            stroke: "#001529",
          },
        },
      }}
      style={{ backgroundColor: "#fff" }}
      enabledStack={true}
      maxStep={10}
      maxZoom={2}
    >
      <HandleGraph
        verticeName={verticeName}
        handleUpdateGrafo={handleUpdateGrafo}
        grafos={grafos}
      />
    </Graphin>
  );
};

export default GraphContainer;
