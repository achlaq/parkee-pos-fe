import React from 'react';
import { Flex, Typography, Button } from 'antd';

const { Text } = Typography;

const Navbar = () => {
  return (
    <Flex justify="space-between" align="center" style={{ marginTop: 0, padding: 10, backgroundColor: '#333', color: 'white' }}>
      <Flex align="center" gap={10}>
        <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: 'lime' }} />
        <Text style={{ color: 'white' }}>CONVENTIONAL / PARKEE Office Agent</Text>
      </Flex>
      <Flex gap={10}>
        <Button type="default">Conventional (F3)</Button>
        <Button type="default">Casual Member (F12)</Button>
        <Button type="default">Exit Manual (F12)</Button>
        <Button type="default">Entry Manual (F12)</Button>
      </Flex>
    </Flex>
  );
};

export default Navbar;