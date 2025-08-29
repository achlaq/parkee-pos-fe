import React, { useEffect, useState, useMemo } from 'react';
import { Card, Flex, Typography, Input, Select, Button, Space, Divider, Form, Modal } from 'antd';
import { CheckOutlined, FileTextOutlined, ReloadOutlined } from '@ant-design/icons';

import { formatDateIndo } from "../utils/dateFormatter";
import Clock from "../components/Clock";
import CameraPlaceholder from "../components/CameraPlaceholder";
import { sanitizePlate } from "../utils/sanitize";

import { useCheckIn } from "../hooks/useTicket";
import { useMemberDetail } from "../hooks/useMember"; 

const { Title, Text, Link } = Typography;

function useDebounced(value, delay = 400) {
  const [v, setV] = React.useState(value);
  React.useEffect(() => {
    const id = setTimeout(() => setV(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return v;
}

const CheckIn = () => {
  const [form] = Form.useForm(); 
  const [modal, contextHolder] = Modal.useModal();

  
  const [plateNumber, setPlateNumber] = useState("");

  const rawPlate = Form.useWatch("plateNumber", form) || "";
  const normalizedPlate = useMemo(() => sanitizePlate(rawPlate), [rawPlate]);
  const debouncedPlate = useDebounced(normalizedPlate, 500);

  const memberQuery = useMemberDetail(debouncedPlate, debouncedPlate.length >= 3);
  const member = memberQuery.data || null;
  const isMember = Boolean(member);

  const checkIn = useCheckIn({
    onSuccess: (data) => {
      if (data?.alreadyInside) {
        modal.error({
          title: "ERROR",
          content: `Kendaraan dengan plat ${data.plateNumber} sudah berada di area.`,
          maskClosable: false,
        });
        return;
      }
      modal.success({
        title: "SUCCESS",
        content: `Check-in berhasil untuk ${data.plateNumber}`,
      });
      form.resetFields();
    },
    onError: (err) => {
      modal.error({ title: "ERROR", content: err?.message || "Check-in gagal" });
      form.resetFields();
    },
  });



  useEffect(() => {
    console.log(member);
  }, [member]);

  return (
    <div 
      // style={{ padding: 40, backgroundColor: '#f0f2f5', minHeight: '100vh' }}
    >
      {contextHolder}
      <Form form={form} layout='vertical' initialValues={{vehicleType: "m"}}>
        <h1>Check In</h1>
        {/* <Title level={4}>Check-in</Title> */}
        <Card style={{ padding: '20px 0'} }>
          <Flex gap={30} style={{ padding: '0 20px' }}>
            {/* Sisi Kiri: Kamera & Formulir */}
            <Flex vertical flex={1}>
              <CameraPlaceholder label="ENTRY CAMERA" height={250} />
              <Card style={{ width: '100%' }}>
                <Flex vertical gap={10}>
                  <Form.Item
                    name="plateNumber"
                    label="Plat Nomor"
                    rules={[{ required: true, message: "Plat wajib diisi" }]}
                    getValueFromEvent={(e) => sanitizePlate(e.target.value)}
                  >
                    <Input placeholder="misal: B5432IT" allowClear />
                  </Form.Item>

                  <Form.Item 
                    name="vehicleType" 
                    label="Jenis Kendaraan (F8)"
                    rules={[{ required: true, message: "Jenis kendaraan wajib dipilih" }]}>
                    <Select
                      showSearch
                      optionFilterProp="value"
                      options={[
                        { value: 'm', label: '(M) MOBIL' },
                        { value: 't', label: '(T) MOTOR' },
                      ]}
                    />
                  </Form.Item>
                </Flex>
              </Card>
            </Flex>

            {/* Sisi Kanan: Informasi & Tombol */}
            <Card
              style={{
                width: "50%",
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: 375,
              }}
            >
              <div>
                <Text type="secondary"><Clock /></Text>
                <br />
                <Text type="secondary">Pintu Masuk</Text>
                <Divider />

                <Space direction="vertical" size={10} style={{ width: "100%" }}>
                  <Flex justify="space-between" style={{ width: "100%" }}>
                    <Text strong>Jenis Parkir</Text>
                    <Text type="secondary">{memberQuery.isFetching ? "Memuat…" : (isMember ? "Member" : "Conventional")}</Text>
                  </Flex>

                  <Flex justify="space-between" style={{ width: "100%" }}>
                    <Text strong>Member Expired</Text>
                    <Text type="secondary">{memberQuery.isFetching ? "Memuat…" : formatDateIndo(member?.memberExpiredDate)}</Text>
                  </Flex>

                  <Flex justify="space-between" style={{ width: "100%" }}>
                    <Text strong>Nama Member</Text>
                    <Text type="secondary">{memberQuery.isFetching ? "Memuat…" : (member?.name ?? "-")}</Text>
                  </Flex>
                </Space>

              </div>

              <Space direction="vertical" style={{ width: '100%', marginTop: "30px" }}>
                <Button
                  type="primary" danger
                  block
                  disabled={normalizedPlate.length < 3 || checkIn.isPending}
                  loading={checkIn.isPending}
                  onClick={() => checkIn.mutate(normalizedPlate)}
                  style={{
                    height: 50
                  }}
                >
                  {<FileTextOutlined />} {checkIn.isPending ? "Memproses..." : "Check-In"}
                </Button>
                <Link
                  style={{ display: 'block', textAlign: 'center', marginTop: 10 }}
                  icon={<ReloadOutlined />}
                >
                  Atur Ulang Halaman (F5)
                </Link>
              </Space>
            </Card>
          </Flex>
        </Card>
      </Form>
    </div>
  );
};

export default CheckIn;