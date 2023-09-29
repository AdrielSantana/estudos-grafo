import React, { useState } from "react";
import { Col, InputNumber, Row, Slider, Space, Typography } from "antd";
import { useTime } from "@/hooks/useTime";

type StepSliderProps = {
    collapsed: boolean;
};

const StepSlider = ({ collapsed }: StepSliderProps) => {
  const { sliderValue, setSliderValue } = useTime();

  const onChange = (newValue: number | null) => {
    setSliderValue(newValue);
  };

  const min = 1;
  const max = 20;

  return (
    <Row style={{ gap: "1rem" }}>
      {!collapsed && (
        <Typography.Text style={{ color: "#fff" }} strong>
          Velocidade dos Passos
        </Typography.Text>
      )}
      <Row style={{ gap: "1rem", width: "100%" }}>
        {!collapsed && (
          <Col span={14}>
            <Slider
              railStyle={{ backgroundColor: "#fff" }}
              min={min}
              max={max}
              onChange={onChange}
              value={typeof sliderValue === "number" ? sliderValue : 0}
            />
          </Col>
        )}
        <Col span={2}>
          <InputNumber
            style={!collapsed ? {} : { width: "50px" }}
            min={min}
            max={max}
            value={sliderValue}
            onChange={onChange}
          />
        </Col>
      </Row>
    </Row>
  );
};

export default StepSlider;
