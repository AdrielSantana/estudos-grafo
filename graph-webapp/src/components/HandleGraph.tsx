import { useGrafos } from "@/hooks/useGrafos";
import { IUserNode } from "@antv/graphin";
import { ContextMenu } from "@antv/graphin-components";
import { EditOutlined } from "@ant-design/icons";

const { Menu } = ContextMenu;

export const HandleGraph = () => {
  const { grafos } = useGrafos();

  const handleNameChange = (data: IUserNode) => {
    const { id } = data;
    const vertice = grafos.find(
      (vertice) => vertice.getIndice() === parseInt(id)
    );
    if (vertice) {
      vertice.setName("teste");
    }
  };

  return (
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
  );
};
