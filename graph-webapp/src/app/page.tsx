"use client";

import GraphContainer from "@/components/GraphContainer";

import { Layout, Menu, Popover, Typography } from "antd";
import { useState } from "react";

import { FloatButton } from "antd";
import { QuestionCircleOutlined, GithubOutlined } from "@ant-design/icons";
import { Footer } from "antd/es/layout/layout";

const { Header, Content } = Layout;

export default function Home() {
  const [layoutType, setLayoutType] = useState("preset");

  return (
    <Layout className="layout">
      <Header>
        <Menu
          mode="horizontal"
          defaultSelectedKeys={["1"]}
          theme="dark"
          items={[
            {
              key: 1,
              label: "Aleatório",
              onClick: () => {
                setLayoutType("random");
              },
            },
            {
              key: 2,
              label: "Árvore",
              onClick: () => {
                setLayoutType("dagre");
              },
            },
            {
              key: 3,
              label: "Concêntrico",
              onClick: () => {
                setLayoutType("concentric");
              },
            },
            {
              key: 4,
              label: "Grade",
              onClick: () => {
                setLayoutType("grid");
              },
            },
            {
              key: 5,
              label: "Circular",
              onClick: () => {
                setLayoutType("circular");
              },
            },
          ]}
        />
      </Header>
      <Content>
        <GraphContainer layoutType={layoutType} />
      </Content>
      <Popover
        placement="leftBottom"
        content={
          <>
            <Typography.Text>
              Para adicionar um vértice, clique em um espaço vazio do grafo.
            </Typography.Text>
          </>
        }
        title="Ajuda"
      >
        <FloatButton
          icon={<QuestionCircleOutlined />}
          type="primary"
          style={{ bottom: "9rem" }}
        />
      </Popover>
      <Footer>
        <a
          href="https://github.com/AdrielSantana/estudos-grafo/tree/webapp"
          target="_blank"
          rel="noopener noreferrer"
        >
          <GithubOutlined style={{ fontSize: "2rem"}} />
        </a>
      </Footer>
    </Layout>
  );
}
