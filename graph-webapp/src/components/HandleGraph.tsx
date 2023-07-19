import {
  IUserNode,
  GraphinContext,
  TooltipValue,
  Components,
  ContextMenuValue,
  IUserEdge,
} from "@antv/graphin";
import { ContextMenu as ContextMenuComponent } from "@antv/graphin-components";
import { EditOutlined } from "@ant-design/icons";
import { useContext } from "react";
import { FloatButton, App, Menu as MenuComponent } from "antd";
import {
  ExpandOutlined,
  ArrowRightOutlined,
  ArrowLeftOutlined,
  ArrowsAltOutlined,
  CloseOutlined,
  PlusOutlined,
  ScissorOutlined
} from "@ant-design/icons";
import { Grafo } from "@/model/Grafo";
import { Item } from "@antv/graphin-components/lib/ContextMenu/Menu";

const { Tooltip, ContextMenu } = Components;

const { Menu } = ContextMenuComponent;

type Props = {
  handleUpdateGrafo: (grafos?: Grafo[]) => void;
  grafos: Grafo[];
  verticeName: string;
};

export const HandleGraph = ({
  grafos,
  handleUpdateGrafo,
  verticeName,
}: Props) => {
  const { message } = App.useApp();
  const { apis } = useContext(GraphinContext);

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
    const { source, target } = data;
    const sourceVertice = grafos.find(
      (vertice) => vertice.getIndice() === parseInt(source)
    );
    const targetVertice = grafos.find(
      (vertice) => vertice.getIndice() === parseInt(target)
    );
    if (sourceVertice && targetVertice) {
      sourceVertice.removeArestaUnidirecional(targetVertice);
      handleUpdateGrafo();
    }
  };

  const handleRemoveNode = (data: IUserNode) => {
    const { id } = data;
    const vertice = grafos.find(
      (vertice) => vertice.getIndice() === parseInt(id)
    );
    if (vertice) {
      const verticeId = grafos.indexOf(vertice);
      grafos.splice(verticeId, 1);
      for (const grafo of grafos) {
        if (grafo.hasArestaUnidirecional(vertice)) {
          const arestas = [...grafo.getArestasAdj()];
          console.log(arestas);
          for (const aresta of arestas) {
            if (aresta == vertice) {
              grafo.removeArestaUnidirecional(vertice);
            }
          }
        }
      }
      handleUpdateGrafo();
    }
  };

  const handleEdgeUpdate = (data: any, item: Item) => {
    const { key } = item;
    switch (key) {
      case "remove-edge":
        handleRemoveEdge(data);
        break;
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

  const handleAddNode = (itemProps: ContextMenuValue, verticeName: string) => {
    const { x, y } = itemProps;
  };

  const handleAddEdge = (
    itemProps: ContextMenuValue,
    order?: "ascending" | "descending"
  ) => {
    const nodes =
      // @ts-ignore
      (itemProps.selectedItems && itemProps.selectedItems.nodes) || [];
    const formmatedNodes = nodes.map((node: any) => {
      const { _cfg } = node;
      const { model } = _cfg;
      return model;
    });
    if (formmatedNodes.length > 2 || formmatedNodes.length < 1) {
      message.error("Selecione um ou dois vértices para adicionar uma aresta!");
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
          sourceVertice.addArestaBidirecional(sourceVertice);
        } else {
          sourceVertice.addArestaUnidirecional(sourceVertice);
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
        sourceVertice.addArestaBidirecional(targetVertice);
      } else {
        sourceVertice.addArestaUnidirecional(targetVertice);
      }
      handleUpdateGrafo();
    }
  };

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
                  key: "add-node",
                  icon: <PlusOutlined />,
                  label: "Adicionar Vertice",
                  onClick: () => {
                    handleAddNode(itemProps, verticeName);
                  },
                },
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
              const grau = vertice.getGrau("adjascente");
              return <div key={value.id}>Grau: {grau}</div>;
            }
            return null;
          }
          return null;
        }}
      </Tooltip>
      <FloatButton
        icon={<ExpandOutlined />}
        tooltip="Centralizar"
        type="default"
        style={{ bottom: "6rem", backgroundColor: "#6096ba" }}
        onClick={() => apis.handleAutoZoom()}
      />
    </>
  );
};
