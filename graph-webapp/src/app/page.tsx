"use client";

import GraphContainer from "@/components/GraphContainer";

import { Layout, Menu, Popover, Space, Typography } from "antd";
import { useState } from "react";

import { FloatButton, Input } from "antd";
import { QuestionCircleOutlined, GithubOutlined } from "@ant-design/icons";
import { Footer } from "antd/es/layout/layout";
import { App } from "antd";

const { Header, Content } = Layout;

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

export default function Home() {
  const [layoutType, setLayoutType] = useState("preset");
  const [verticeName, setVerticeName] = useState("v5");

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
            <>
              <Typography.Text>
                Para adicionar um vértice, <br />
                clique em um espaço vazio do grafo.
              </Typography.Text>
            </>
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
        </Footer>
      </Layout>
    </App>
  );
}
