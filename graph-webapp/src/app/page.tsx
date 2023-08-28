"use client";

import GraphContainer from "@/components/GraphContainer";

import {
  Button,
  Layout,
  List,
  Menu,
  MenuProps,
  Popover,
  Space,
  Typography,
} from "antd";
import { useState } from "react";

import { FloatButton, Input } from "antd";
import {
  QuestionCircleOutlined,
  GithubOutlined,
  PlusOutlined,
  PieChartOutlined,
  DesktopOutlined,
  UserOutlined,
  TeamOutlined,
  FileOutlined,
} from "@ant-design/icons";
import { App } from "antd";
import { Grafo } from "@/model/Grafo";
import { GrafoContext, useGrafos } from "@/hooks/useGrafos";

const { Header, Content, Sider, Footer } = Layout;

interface IHelpData {
  title: string;
  description: string;
}

const HELP_DATA: IHelpData[] = [
  {
    title: "Exibição",
    description:
      "Utilize o Menu acima para escolher qual forma quer exibir o Grafo",
  },
  {
    title: "Manipulação",
    description:
      "Clique com o botão direito em cima do Vértice, Aresta ou Plano para exibir as opções.",
  },
];

const OPTIONS: {
  label: string;
  value: string;
}[] = [
  {
    label: "Aleatório",
    value: "random",
  },
  {
    label: "Árvore",
    value: "dagre",
  },
  {
    label: "Concêntrico",
    value: "concentric",
  },
  {
    label: "Grade",
    value: "grid",
  },
  {
    label: "Circular",
    value: "circular",
  },
  {
    label: "Radial",
    value: "radial",
  },
  {
    label: "Junção",
    value: "mds",
  },
];

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem("Option 1", "1", <PieChartOutlined />),
  getItem("Option 2", "2", <DesktopOutlined />),
  getItem("User", "sub1", <UserOutlined />, [
    getItem("Tom", "3"),
    getItem("Bill", "4"),
    getItem("Alex", "5"),
  ]),
  getItem("Team", "sub2", <TeamOutlined />, [
    getItem("Team 1", "6"),
    getItem("Team 2", "8"),
  ]),
  getItem("Files", "9", <FileOutlined />),
];

const Page = () => {
  const [layoutType, setLayoutType] = useState("preset");
  const [verticeName, setVerticeName] = useState("v5");
  const [collapsed, setCollapsed] = useState(true);
  const { grafos, handleUpdateGrafo } = useGrafos();

  const handleAddNode = (verticeName: string) => {
    const newIndice = grafos.length;
    const newGrafo = new Grafo(newIndice, verticeName);
    grafos.push(newGrafo);
    handleUpdateGrafo();
  };

  const sideBarWidth = 320;

  return (
    <Layout style={{ height: "calc(100% - 0.5rem)" }}>
      <Sider
        width={sideBarWidth}
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        style={{
          minHeight: "100vh",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 2,
        }}
      >
        <Menu
          theme="dark"
          defaultSelectedKeys={["1"]}
          mode="inline"
          items={items}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            marginTop: "2rem",
            flexDirection: "column",
            padding: "0 1.5rem",
            gap: "1rem",
          }}
        >
          <div style={{ display: "flex", gap: "1rem" }}>
            {!collapsed && (
              <Input
                placeholder={"v5"}
                value={verticeName}
                onChange={(e) => {
                  setVerticeName(e.currentTarget.value);
                }}
                style={{ backgroundColor: "#e7ecef" }}
              />
            )}
            <Button
              shape="circle"
              onClick={() => {
                handleAddNode(verticeName);
              }}
            >
              <PlusOutlined />
            </Button>
          </div>
          <Button
            icon={<GithubOutlined />}
            shape="default"
            href="https://github.com/AdrielSantana/estudos-grafo/tree/webapp"
            target="_blank"
          >
            {!collapsed && "Github"}
          </Button>
        </div>
      </Sider>
      <Layout
        style={{
          marginLeft: 80,
          height: "100%",
          width: `calc(100% - 80px)`,
        }}
      >
        <Header>
          <Menu
            mode="horizontal"
            defaultSelectedKeys={["1"]}
            theme="dark"
            items={OPTIONS.map((option) => {
              return {
                key: option.value,
                label: option.label,
                onClick: () => {
                  setLayoutType(option.value);
                },
              };
            })}
          />
        </Header>
        <Content>
          <GraphContainer verticeName={verticeName} layoutType={layoutType} />
        </Content>
        <Popover
          placement="leftBottom"
          content={
            <List
              style={{ width: 250 }}
              dataSource={HELP_DATA}
              renderItem={(item: IHelpData) => (
                <List.Item>
                  <Space direction="vertical">
                    <Typography.Text strong>{item.title}</Typography.Text>
                    <Typography.Text>{item.description}</Typography.Text>
                  </Space>
                </List.Item>
              )}
            />
          }
          title="Ajuda"
        >
          <FloatButton
            icon={<QuestionCircleOutlined />}
            type="default"
            style={{ bottom: "6rem", backgroundColor: "#6096ba" }}
          />
        </Popover>
      </Layout>
    </Layout>
  );
};

export default function Home() {
  return (
    <App className="layout">
      <GrafoContext>
        <Page />
      </GrafoContext>
    </App>
  );
}
