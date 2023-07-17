import Graphin, { Behaviors } from "@antv/graphin";
import { useGrafos } from "@/hooks/useGrafos";
import { HandleGraph } from "./HandleGraph";

const { ZoomCanvas } = Behaviors;

type Props = {
  layoutType: string;
};

const GraphContainer = ({ layoutType }: Props) => {
  const { edges, nodes } = useGrafos();

  return (
    <Graphin
      containerId="Graphin"
      data={{ nodes, edges }}
      layout={{ type: layoutType }}
    >
      <HandleGraph />
      <ZoomCanvas maxZoom={2} />
    </Graphin>
  );
};

export default GraphContainer;
