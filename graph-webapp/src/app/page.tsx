"use client";

import GraphContainer from "@/components/GraphContainer";

import {
  Button,
  Layout,
  List,
  Menu,
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
} from "@ant-design/icons";
import { App } from "antd";
import { Grafo } from "@/model/Grafo";
import { GrafoContext, useGrafos } from "@/hooks/useGrafos";
import { HEADER_OPTIONS } from "@/constants/header-options";
import { HELP_DATA, IHelpData } from "@/constants/help-data";

const { Header, Content, Sider } = Layout;

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
          height: "100vh",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 2,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "2rem",
            flexDirection: "column",
            padding: "0 1.5rem",
            minHeight: '100%',
            gap: "1rem",
            paddingBottom: "4rem",
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
            items={HEADER_OPTIONS.map((option) => {
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
