import {
  IUserNode,
  GraphinContext,
  TooltipValue,
  Components,
  ContextMenuValue,
  IUserEdge,
} from "@antv/graphin";
import { Main } from "@/model/Main";
import { ContextMenu as ContextMenuComponent } from "@antv/graphin-components";
import { useContext } from "react";
import { FloatButton, App, Menu as MenuComponent } from "antd";
import {
  EditOutlined,
  PlusCircleFilled,
  ExpandOutlined,
  ArrowRightOutlined,
  ArrowLeftOutlined,
  ArrowsAltOutlined,
  CloseOutlined,
  ScissorOutlined,
  NodeIndexOutlined,
  ForwardOutlined,
  BackwardOutlined,
} from "@ant-design/icons";
import { Item } from "@antv/graphin-components/lib/ContextMenu/Menu";
import { useGrafos } from "@/hooks/useGrafos";
import { Aresta } from "@/model/Aresta";
import { useTime } from "@/hooks/useTime";

const { Tooltip, ContextMenu } = Components;

const { Menu } = ContextMenuComponent;

type Props = {
  verticeName: string;
};

type Path = {
  nodes: string[];
  edges: string[];
};

const main = new Main();

export const HandleGraph = ({ verticeName }: Props) => {
  const { message } = App.useApp();
  const { apis, graph } = useContext(GraphinContext);
  const { grafos, handleUpdateGrafo } = useGrafos();
  const { sliderValue } = useTime();
  const nodes = graph.getNodes();
  const edges = graph.getEdges();

  const handleNameChange = (data: IUserNode) => {
    const { id } = data;
    const vertice = grafos.find(
      (vertice) => vertice.getIndice() === parseInt(id)
    );
    if (vertice) {
      vertice.setName(verticeName);
      handleUpdateGrafo();
    }
  };

  const handleRemoveEdge = (data: IUserEdge) => {
    const { source, target, weight } = data;
    console.log(data);
    const sourceVertice = grafos.find(
      (vertice) => vertice.getIndice() === parseInt(source)
    );
    const targetVertice = grafos.find(
      (vertice) => vertice.getIndice() === parseInt(target)
    );
    if (sourceVertice && targetVertice) {
      const aresta = sourceVertice.getArestasAdj().find((aresta) => {
        return (
          aresta.getTarget().getIndice() === targetVertice.getIndice() &&
          aresta.getPeso() === weight
        );
      }) as Aresta;
      message.info(`Aresta ${aresta.getName()} removida.`);
      sourceVertice.removeArestaUnidirecional(aresta);

      handleUpdateGrafo();
    }
  };

  const handleEditEdgeName = (data: IUserEdge) => {
    const { source, target, weight } = data;
    const sourceVertice = grafos.find(
      (vertice) => vertice.getIndice() === parseInt(source)
    );
    const targetVertice = grafos.find(
      (vertice) => vertice.getIndice() === parseInt(target)
    );
    if (sourceVertice && targetVertice) {
      const aresta = sourceVertice.getArestasAdj().find((aresta) => {
        return (
          aresta.getTarget().getIndice() === targetVertice.getIndice() &&
          aresta.getPeso() === weight
        );
      }) as Aresta;
      message.info(
        `Nome da aresta ${aresta.getName()} alterado para ${verticeName}.`
      );
      aresta.setName(verticeName);
      handleUpdateGrafo();
    }
  };

  const handleEditEdgePeso = (data: IUserEdge) => {
    const peso = Number(verticeName);

    if (isNaN(peso) || peso < 0) {
      message.error("Peso precisa ser um número positivo!");
      return;
    }

    const { source, target, weight } = data;
    const sourceVertice = grafos.find(
      (vertice) => vertice.getIndice() === parseInt(source)
    );
    const targetVertice = grafos.find(
      (vertice) => vertice.getIndice() === parseInt(target)
    );
    if (sourceVertice && targetVertice) {
      const aresta = sourceVertice.getArestasAdj().find((aresta) => {
        return (
          aresta.getTarget().getIndice() === targetVertice.getIndice() &&
          aresta.getPeso() === weight
        );
      }) as Aresta;
      message.info(
        `Peso da aresta ${aresta.getName()} alterado de ${aresta.getPeso()} para ${peso}.`
      );
      aresta.setPeso(peso);
      handleUpdateGrafo();
    }
  };

  const handleRemoveNode = (data: IUserNode) => {
    const { id } = data;
    const vertice = grafos.find(
      (vertice) => vertice.getIndice() === parseInt(id)
    );
    if (vertice) {
      main.completeRemoveNodeFromGraph(vertice, grafos);
      message.info(`Vértice ${vertice.getName()} removido.`);
      handleUpdateGrafo();
    }
  };

  const handleEdgeUpdate = (data: any, item: Item) => {
    const { key } = item;
    switch (key) {
      case "remove-edge":
        handleRemoveEdge(data);
        break;
      case "edit-edge-name":
        handleEditEdgeName(data);
        break;
      case "edit-edge-peso":
        handleEditEdgePeso(data);
      default:
        break;
    }
  };

  const handleNodeUpdate = (data: IUserNode, item: Item) => {
    const { key } = item;
    switch (key) {
      case "edit-name":
        handleNameChange(data);
        break;
      case "remove-node":
        handleRemoveNode(data);
      default:
        break;
    }
  };

  const getNodes = (itemProps: ContextMenuValue): any => {
    const nodes =
      // @ts-ignore
      (itemProps.selectedItems && itemProps.selectedItems.nodes) || [];
    const formmatedNodes = nodes.map((node: any) => {
      const { _cfg } = node;
      const { model } = _cfg;
      return model;
    });

    return formmatedNodes;
  };

  const handleAddEdge = (
    itemProps: ContextMenuValue,
    order?: "ascending" | "descending"
  ) => {
    const formmatedNodes = getNodes(itemProps);

    if (formmatedNodes.length > 2 || formmatedNodes.length < 1) {
      message.error("Selecione 1 ou 2 vértices");
      return;
    }

    if (formmatedNodes.length === 1) {
      let [source] = formmatedNodes;
      const { id: sourceId } = source;
      const sourceVertice = grafos.find(
        (vertice) => vertice.getIndice() === parseInt(sourceId)
      );
      if (sourceVertice) {
        if (!order) {
          sourceVertice.addArestaBidirecional(
            new Aresta(
              `${sourceVertice.getName()} -> ${sourceVertice.getName()}`,
              1,
              sourceVertice
            )
          );
          message.info(
            `Aresta ${sourceVertice.getName()} -> ${sourceVertice.getName()} adicionada.`
          );
        } else {
          sourceVertice.addArestaUnidirecional(
            new Aresta(
              `${sourceVertice.getName()} -> ${sourceVertice.getName()}`,
              1,
              sourceVertice
            )
          );
          message.info(
            `Aresta ${sourceVertice.getName()} -> ${sourceVertice.getName()} adicionada.`
          );
        }
        handleUpdateGrafo();
      }
      return;
    }

    let [source, target] = formmatedNodes;

    if (order === "descending") {
      [source, target] = [target, source];
    } else {
      [source, target] = [source, target];
    }

    const { id: sourceId } = source;
    const { id: targetId } = target;

    const sourceVertice = grafos.find(
      (vertice) => vertice.getIndice() === parseInt(sourceId)
    );
    const targetVertice = grafos.find(
      (vertice) => vertice.getIndice() === parseInt(targetId)
    );

    if (sourceVertice && targetVertice) {
      if (!order) {
        sourceVertice.addArestaBidirecional(
          new Aresta(
            `${sourceVertice.getName()} -> ${targetVertice.getName()}`,
            1,
            targetVertice
          )
        );
        message.info(
          `Aresta ${sourceVertice.getName()} -> ${targetVertice.getName()} adicionada.`
        );
        message.info(
          `Aresta ${targetVertice.getName()} -> ${sourceVertice.getName()} adicionada.`
        );
      } else {
        sourceVertice.addArestaUnidirecional(
          new Aresta(
            `${sourceVertice.getName()} -> ${targetVertice.getName()}`,
            1,
            targetVertice
          )
        );
        message.info(
          `Aresta ${sourceVertice.getName()} -> ${targetVertice.getName()} adicionada.`
        );
      }
      handleUpdateGrafo();
    }
  };

  const showPathBetweenNodes = (
    itemProps: ContextMenuValue,
    order?: "ascending" | "descending"
  ) => {
    const formmatedNodes = getNodes(itemProps);

    if (formmatedNodes.length != 2) {
      message.error("Selecione 2 vértices");
      return;
    } else {
      let [source, target] = formmatedNodes;

      if (order === "descending") {
        [source, target] = [target, source];
      } else {
        [source, target] = [source, target];
      }

      const { id: sourceId } = source;
      const { id: targetId } = target;

      const sourceVertice = grafos.find(
        (vertice) => vertice.getIndice() === parseInt(sourceId)
      );
      const targetVertice = grafos.find(
        (vertice) => vertice.getIndice() === parseInt(targetId)
      );

      if (sourceVertice && targetVertice) {
        try {
          const tempoInicial = performance.now()
          const { realPath } = main.findShortestPath(
            sourceVertice,
            targetVertice,
            grafos
          );
          const tempoFinal = performance.now()

          const formmatedEdgePath: string[] = [];

          for (let i = 1; i < realPath.length; i++) {
            const source = realPath[i - 1];
            const target = realPath[i];
            const edge = edges.find(
              (edge) =>
                edge.getSource().getModel().id ===
                  source.node.getIndice().toString() &&
                edge.getTarget().getModel().id ===
                  target.node.getIndice().toString() &&
                edge.getModel().weight === target.distance
            );
            formmatedEdgePath.push(edge?._cfg?.model?.id as string);
          }

          const formmatedNodePath = realPath
            .map((vertice) => {
              const node = nodes.find(
                (node) =>
                  node.getModel().id === vertice.node.getIndice().toString()
              );
              return node?.getID();
            })
            .filter((node) => node) as string[];

          handleShowPath({
            nodes: formmatedNodePath,
            edges: formmatedEdgePath,
          });

          const distance = realPath.reduce((acc, curr) => {
            return acc + curr.distance;
          }, 0);

          const tempoGasto = tempoFinal - tempoInicial

          message.success(
            `Caminho encontrado, a distância mínima do vértice ${realPath[0].node.getName()} até o vértice ${realPath[
              realPath.length - 1
            ].node.getName()} é ${distance}. O Algorítmo gastou ${tempoGasto.toFixed(2)} milissegundos para encontrar o resultado`,
            () => {
              handleClear({
                nodes: formmatedNodePath,
                edges: formmatedEdgePath,
              });
            }
          );
        } catch (error) {
          if (error instanceof Error) {
            message.error(error.message);
          }
        }
      }
    }
  };

  const showStepsBetweenNodes = (
    itemProps: ContextMenuValue,
    order?: "ascending" | "descending"
  ) => {
    const formmatedNodes = getNodes(itemProps);

    if (formmatedNodes.length != 2) {
      message.error("Selecione 2 vértices");
      return;
    } else {
      let [source, target] = formmatedNodes;

      if (order === "descending") {
        [source, target] = [target, source];
      } else {
        [source, target] = [source, target];
      }

      const { id: sourceId } = source;
      const { id: targetId } = target;

      const sourceVertice = grafos.find(
        (vertice) => vertice.getIndice() === parseInt(sourceId)
      );
      const targetVertice = grafos.find(
        (vertice) => vertice.getIndice() === parseInt(targetId)
      );

      if (sourceVertice && targetVertice) {
        try {
          const { nodePath } = main.findShortestPath(
            sourceVertice,
            targetVertice,
            grafos
          );

          for (let j = 1; j < nodePath.length; j++) {
            const source = nodePath[j - 1];
            const target = nodePath[j];

            const edge = edges.find((edge) => {
              return (
                edge.getSource().getModel().id ===
                  source.node.getIndice().toString() &&
                edge.getTarget().getModel().id ===
                  target.node.getIndice().toString() &&
                edge.getModel().weight === target.distance
              );
            });

            const actualEdgePath = [edge?._cfg?.model?.id] as string[];

            const actualNodePath = [source, target]
              .map((vertice) => {
                const node = nodes.find(
                  (node) =>
                    node.getModel().id === vertice.node.getIndice().toString()
                );
                return node?.getID();
              })
              .filter((node) => node) as string[];

            setTimeout(() => {
              handleShowPath({
                nodes: actualNodePath,
                edges: actualEdgePath,
              });
            }, j * 100 * (sliderValue || 1));

            setTimeout(() => {
              handleClear({
                nodes: actualNodePath,
                edges: actualEdgePath,
              });
            }, (j + 1) * 100 * (sliderValue || 1));
          }
          message.success("Caminho encontrado, exibindo passos.");
        } catch (error) {
          if (error instanceof Error) {
            message.error(error.message);
          }
        }
      }
    }
  };

  function handleShowPath(path: Path) {
    nodes.forEach((node) => {
      const model = node.getModel();
      if (!path.nodes.includes(model.id as string)) {
        graph.setItemState(node, "inactive", true);
      }
    });
    edges.forEach((edge) => {
      const model = edge.getModel();
      if (!path.edges.includes(model.id as string)) {
        graph.setItemState(edge, "inactive", true);
      } else {
        graph.setItemState(edge, "active", true);
      }
    });
  }

  function handleClear(path: Path) {
    nodes.forEach((node) => {
      const model = node.getModel();
      if (!path.nodes.includes(model.id as string)) {
        graph.setItemState(node, "inactive", false);
      }
    });
    edges.forEach((edge) => {
      const model = edge.getModel();
      if (!path.edges.includes(model.id as string)) {
        graph.setItemState(edge, "inactive", false);
      } else {
        graph.setItemState(edge, "active", false);
      }
    });
  }

  return (
    <>
      <ContextMenuComponent bindType="node">
        <Menu
          bindType="node"
          options={[
            {
              key: "edit-name",
              icon: <EditOutlined />,
              name: "Editar Nome",
            },
            {
              key: "remove-node",
              icon: <CloseOutlined />,
              name: "Remover Vértice",
            },
          ]}
          onChange={(item, data) => {
            handleNodeUpdate(data, item);
          }}
        />
      </ContextMenuComponent>
      <ContextMenuComponent bindType="edge">
        <Menu
          bindType="edge"
          options={[
            {
              key: "remove-edge",
              icon: <ScissorOutlined />,
              name: "Remover Aresta",
            },
            {
              key: "edit-edge-name",
              icon: <EditOutlined />,
              name: "Editar Nome",
            },
            {
              key: "edit-edge-peso",
              icon: <PlusCircleFilled />,
              name: "Mudar Peso",
            },
          ]}
          onChange={(item, data) => {
            handleEdgeUpdate(data, item);
          }}
        />
      </ContextMenuComponent>
      <ContextMenu
        style={{ backgroundColor: "#fff", width: "fit-content" }}
        bindType="canvas"
      >
        {(itemProps: ContextMenuValue) => {
          return (
            <MenuComponent
              items={[
                {
                  key: "add-ascending-edge",
                  icon: <ArrowRightOutlined />,
                  label: "Adicionar Aresta Unilateral",
                  onClick: () => {
                    handleAddEdge(itemProps, "ascending");
                  },
                },
                {
                  key: "add-descending-edge",
                  icon: <ArrowLeftOutlined />,
                  label: "Adicionar Aresta Unilateral",
                  onClick: () => {
                    handleAddEdge(itemProps, "descending");
                  },
                },
                {
                  key: "add-bilateral-edge",
                  icon: <ArrowsAltOutlined />,
                  label: "Adicionar Aresta Bilateral",
                  onClick: () => {
                    handleAddEdge(itemProps);
                  },
                },
                {
                  key: "show-path-ascending",
                  icon: <NodeIndexOutlined />,
                  label: "Mostrar Caminho (Ida)",
                  onClick: () => {
                    showPathBetweenNodes(itemProps, "ascending");
                  },
                },
                {
                  key: "show-path-descending",
                  icon: <NodeIndexOutlined />,
                  label: "Mostrar Caminho (Volta)",
                  onClick: () => {
                    showPathBetweenNodes(itemProps, "descending");
                  },
                },
                {
                  key: "show-steps-ascending",
                  icon: <ForwardOutlined />,
                  label: "Mostrar Passos (Ida)",
                  onClick: () => {
                    showStepsBetweenNodes(itemProps, "ascending");
                  },
                },
                {
                  key: "show-steps-descending",
                  icon: <BackwardOutlined />,
                  label: "Mostrar Passos (Volta)",
                  onClick: () => {
                    showStepsBetweenNodes(itemProps, "descending");
                  },
                },
              ]}
            />
          );
        }}
      </ContextMenu>
      <Tooltip
        bindType="node"
        placement={"top"}
        hasArrow={false}
        style={{
          backgroundColor: "white",
          borderRadius: "1rem",
          padding: "1rem",
          width: "fit-content",
        }}
      >
        {(value: TooltipValue) => {
          if (value.model) {
            const { model } = value;
            const vertice = grafos.find(
              (vertice) => vertice.getIndice() === parseInt(model.id as string)
            );
            if (vertice) {
              try {
                const grau = main.getGrauDirecionado(grafos, vertice);
                return <div key={value.id}>Grau: {grau}</div>;
              } catch (error) {
                message.error(error as string);
              }
            }
            return null;
          }
          return null;
        }}
      </Tooltip>
      <Tooltip
        bindType="edge"
        placement={"top"}
        hasArrow={false}
        style={{
          backgroundColor: "white",
          borderRadius: "1rem",
          padding: "1rem",
          width: "fit-content",
        }}
      >
        {(value: TooltipValue) => {
          if (value.model) {
            const { model } = value;
            return <div key={value.id}>Peso: {model.weight as number}</div>;
          }
          return null;
        }}
      </Tooltip>
      <FloatButton
        icon={<ExpandOutlined />}
        tooltip="Centralizar"
        type="default"
        style={{ bottom: "2rem", backgroundColor: "#6096ba" }}
        onClick={() => apis.handleAutoZoom()}
      />
    </>
  );
};
