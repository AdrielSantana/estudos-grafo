"use client";

import GraphContainer from "@/components/GraphContainer";

import { Button, Layout, List, Menu, Popover, Space, Typography } from "antd";
import { useState } from "react";

import { FloatButton, Input } from "antd";
import {
  QuestionCircleOutlined,
  GithubOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Footer } from "antd/es/layout/layout";
import { App } from "antd";
import { Grafo } from "@/model/Grafo";
import { GrafoContext, useGrafos } from "@/hooks/useGrafos";

const { Header, Content } = Layout;

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

const Page = () => {
  const [layoutType, setLayoutType] = useState("preset");
  const [verticeName, setVerticeName] = useState("v5");
  const { grafos, handleUpdateGrafo } = useGrafos();

  const handleAddNode = (verticeName: string) => {
    const newIndice = grafos.length;
    const newGrafo = new Grafo(newIndice, verticeName);
    grafos.push(newGrafo);
    handleUpdateGrafo();
  };

  return (
    <App className="layout">
      <Layout className="layout">
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
            style={{ bottom: "9rem", backgroundColor: "#6096ba" }}
          />
        </Popover>
        <FloatButton
          type="default"
          icon={<GithubOutlined />}
          shape="square"
          href="https://github.com/AdrielSantana/estudos-grafo/tree/webapp"
          target="_blank"
          tooltip="Github"
          style={{ left: "2rem", bottom: "6rem", backgroundColor: "#6096ba" }}
        />
        <Footer
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "2rem",
            backgroundColor: "#001529",
          }}
        >
          <Input
            placeholder={"v5"}
            value={verticeName}
            onChange={(e) => {
              setVerticeName(e.currentTarget.value);
            }}
            style={{ width: 200, backgroundColor: "#e7ecef" }}
          />
          <Button
            shape="circle"
            onClick={() => {
              handleAddNode(verticeName);
            }}
          >
            <PlusOutlined />
          </Button>
        </Footer>
      </Layout>
    </App>
  );
};

export default function Home() {
  return (
    <GrafoContext>
      <Page />
    </GrafoContext>
  );
}
