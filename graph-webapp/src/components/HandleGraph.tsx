import { IUserNode, GraphinContext } from "@antv/graphin";
import { ContextMenu } from "@antv/graphin-components";
import { EditOutlined } from "@ant-design/icons";
import { useContext } from "react";
import { FloatButton } from "antd";
import { ExpandOutlined } from "@ant-design/icons";
import { Grafo } from "@/model/Grafo";

const { Menu } = ContextMenu;

type Props = {
  updateGrafo: (grafo: any) => void;
  grafos: Grafo[];
};

export const HandleGraph = ({ grafos, updateGrafo }: Props) => {
  const { apis } = useContext(GraphinContext);

  const handleNameChange = (data: IUserNode) => {
    const { id } = data;
    const vertice = grafos.find(
      (vertice) => vertice.getIndice() === parseInt(id)
    );
    if (vertice) {
      vertice.setName("teste");
      updateGrafo(vertice);
    }
  };

  return (
    <>
      <ContextMenu bindType="node">
        <Menu
          bindType="node"
          options={[
            { key: "edit-name", icon: <EditOutlined />, name: "Editar Nome" },
          ]}
          onChange={(item, data) => {
            handleNameChange(data);
          }}
        />
      </ContextMenu>
      <FloatButton
        icon={<ExpandOutlined />}
        type="primary"
        style={{ bottom: "6rem" }}
        onClick={() => apis.handleAutoZoom()}
      />
    </>
  );
};
