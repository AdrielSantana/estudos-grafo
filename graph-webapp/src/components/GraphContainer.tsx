"use client";

import Graphin, { Behaviors } from "@antv/graphin";
import { useGrafos } from "@/hooks/useGrafos";
import { HandleGraph } from "./HandleGraph";
import { useEffect, useState } from "react";
import { Grafo } from "@/model/Grafo";

const { ZoomCanvas } = Behaviors;

type Props = {
  layoutType: string;
};

const GraphContainer = ({ layoutType }: Props) => {
  const { edges, nodes, grafos, handleUpdateGrafo } = useGrafos();

  const updateGrafo = (grafo: Grafo) => {
    handleUpdateGrafo(grafo);
  };

  return (
    <Graphin
      containerId="Graphin"
      data={{ nodes, edges }}
      layout={{ type: layoutType }}
    >
      <HandleGraph updateGrafo={updateGrafo} grafos={grafos} />
      <ZoomCanvas maxZoom={2} />
    </Graphin>
  );
};

export default GraphContainer;
