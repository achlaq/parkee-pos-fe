import React from "react";
import { Typography } from "antd";

const { Text } = Typography;

const CameraPlaceholder = ({ label, height = 150 }) => {
  return (
    <div
      style={{
        width: "100%",
        height,
        backgroundColor: "#f5f5f5",
        border: "1px solid #d9d9d9",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <Text type="secondary" style={{ fontSize: 10 }}>
        {label}
      </Text>
    </div>
  );
};

export default CameraPlaceholder;
