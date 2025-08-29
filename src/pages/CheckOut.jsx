import React, { useEffect, useState, useMemo } from 'react';
import { Card, Flex, Typography, Input, Select, Button, Space, Divider, Form, Modal } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';

import { formatDateIndo } from "../utils/dateFormatter";
import { formatDuration } from "../utils/durationFormatter";
import Clock from "../components/Clock";
import CameraPlaceholder from "../components/CameraPlaceholder";
import { sanitizePlate } from "../utils/sanitize";

import { useMemberDetail } from "../hooks/useMember"; 
import { usePreviewCheckOut, useCheckOut  } from "../hooks/useTicket"; 

const { Title, Text, Link } = Typography;


function useDebounced(value, delay = 400) {
  const [v, setV] = React.useState(value);
  React.useEffect(() => {
    const id = setTimeout(() => setV(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return v;
}

const CheckOut = () => {
  const [form] = Form.useForm(); 
  const [modal, contextHolder] = Modal.useModal();
  
  const [plateNumber, setPlateNumber] = useState("");
  
  const rawPlate = Form.useWatch("plateNumber", form) || "";
  const normalizedPlate = useMemo(() => sanitizePlate(rawPlate), [rawPlate]);
  const debouncedPlate = useDebounced(normalizedPlate, 500);

  const rawVoucher = Form.useWatch("voucherId", form) || "";
  const normalizedVoucher = useMemo(() => sanitizePlate(rawVoucher), [rawVoucher]);
  const debouncedVoucher = useDebounced(normalizedVoucher, 500);

  const memberQuery = useMemberDetail(debouncedPlate, debouncedPlate.length >= 3);
  const member = memberQuery.data || null;
  const isMember = Boolean(member);

  const previewCheckOutQuery = usePreviewCheckOut(debouncedPlate, debouncedVoucher);
  const previewCheckOut = previewCheckOutQuery.data;

  useEffect(() => {
    if (previewCheckOut?.preview) {
      form.setFieldsValue({
        ticketId: previewCheckOut.id
      });
    } else if (!previewCheckOut?.preview){
      form.setFieldsValue({
        ticketId: null
      });
    }
  }, [previewCheckOut])


  const checkOut = useCheckOut({
    onSuccess: (data) => {
      modal.success({
        title: "SUCCESS",
        content: `Check-out berhasil untuk ${data.plateNumber}`,
      });
      form.resetFields();
    },
    onError: (err) => {
      modal.error({ title: "ERROR", content: err?.message || "Check-in gagal" });
      form.resetFields();
    },
  });

  return (
    <div 
      // style={{ padding: 40, backgroundColor: '#f0f2f5', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}
    >
      {/* <Title level={4}>Check Out</Title> */}
      {contextHolder}
      <Form form={form} layout="vertical">
        <h1>Check Out</h1>
        {/* Main Content: Two Columns */}
        <Flex gap={30} flex={1}>
          {/* Sisi Kiri: Kamera & Formulir */}
          <Flex vertical flex={2}>
            {/* Bagian Kamera */}
            <Flex gap={20} style={{ marginBottom: 20 }}>
              <Flex vertical flex={1} gap={20}>
                <CameraPlaceholder label="ENTRY CAMERA" />
                <CameraPlaceholder label="FACE ENTRY CAMERA" />
              </Flex>
              <Flex vertical flex={1} gap={20}>
                <CameraPlaceholder label="EXIT CAMERA" />
                <CameraPlaceholder label="FACE EXIT CAMERA" />
              </Flex>
            </Flex>

            {/* Bagian Formulir yang sudah siap */}
            <Card style={{ width: '100%' }}>
              <Form.Item
                name="plateNumber"
                label="Plat Nomor"
                rules={[{ required: true, message: "Plat wajib diisi" }]}
                getValueFromEvent={(e) => sanitizePlate(e.target.value)}
              >
                <Input placeholder="misal: B5432IT" allowClear />
              </Form.Item>
              <Form.Item name="vehicleType" label="Jenis Kendaraan (F8)">
                <Select
                  defaultValue="mobil"
                  options={[{ value: 'mobil', label: 'MOBIL (M)' }]}
                />
              </Form.Item>
              <Form.Item name="paymentMethod" label="Metode Pembayaran (F9)">
                <Select
                  defaultValue="cash"
                  options={[{ value: 'cash', label: 'CASH' }]}
                />
              </Form.Item>
              <Form.Item name="ticketId" label="Nomor Parking Slip (F6)">
                <Input readOnly/>
              </Form.Item>
              <Form.Item name="voucherId" label="Kode Voucher (F10)" getValueFromEvent={(e) => sanitizePlate(e.target.value)}>
                <Input />
              </Form.Item>
            </Card>
          </Flex>

          {/* Sisi Kanan: Informasi & Tombol */}
          <Card
            bordered={false}
            style={{ width: "45%", display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 620 }}
          >
            <div>
              <Text type="secondary"><Clock /></Text>
              <br />
              <Text type="secondary">Casby</Text>
              <Divider />
              <Space direction="vertical" style={{ width: '100%' }}>
                <Flex justify="space-between"><Text strong>Sistem Gerbang</Text><Text type="secondary">CASUAL_POS</Text></Flex>
                <Flex justify="space-between"><Text strong>Jenis Parkir</Text><Text type="secondary">{memberQuery.isFetching ? "Memuat…" : (isMember ? "Member" : "Conventional")}</Text></Flex>
                <Flex justify="space-between"><Text strong>Member Expired</Text><Text type="secondary">{memberQuery.isFetching ? "Memuat…" : formatDateIndo(member?.memberExpiredDate)}</Text></Flex>
                <Flex justify="space-between"><Text strong>Nama Member</Text><Text type="secondary">{memberQuery.isFetching ? "Memuat…" : (member?.name ?? "-")}</Text></Flex>
                <Flex justify="space-between"><Text strong>Unit Member</Text><Text type="secondary">-</Text></Flex>
                <Flex justify="space-between"><Text strong>Waktu Masuk</Text><Text type="secondary">{previewCheckOut ? formatDateIndo(previewCheckOut.checkInAt) : "-"}</Text></Flex>
                <Flex justify="space-between"><Text strong>Waktu Keluar</Text><Text type="secondary">{previewCheckOut ? formatDateIndo(previewCheckOut.checkOutAt) : "-"}</Text></Flex>
                <Flex justify="space-between"><Text strong>Sesi</Text><Text type="secondary">{previewCheckOut
                  ? `${previewCheckOut.durationMinutes} minutes` : "0 minutes"}</Text></Flex>
                <Flex justify="space-between"><Text strong>Diskon</Text><Text type="secondary">{previewCheckOut
                  ? `Rp ${Number(previewCheckOut.discount ?? 0).toLocaleString("id-ID")}`
                  : "Rp 0,00"}</Text></Flex>
                <Flex justify="space-between"><Text strong>Promo</Text><Text type="secondary">Rp 0,00</Text></Flex>
              </Space>
            </div>

            <div style={{ textAlign: 'center' }}>
              <Title level={2} style={{ margin: '10px 0' }}>Total Price <Text type="secondary" style={{ fontSize: 20 }}>{previewCheckOut
                ? `Rp ${Number(previewCheckOut.totalPrice ?? 0).toLocaleString("id-ID")}`
                : "Rp 0,00"}</Text></Title>
              <Text type="secondary">{previewCheckOut
                ? formatDuration(previewCheckOut.durationMinutes)
                : "0 days 0 hours 0 minutes"}</Text>
              </div>

            <Space direction="vertical" style={{ width: '100%' }}>
              <Button
                type="primary"
                danger
                style={{ width: "100%", height: 50 }}
                disabled={previewCheckOut?.id == null}
                onClick={() =>
                  checkOut.mutate({
                    plateNumber: debouncedPlate,
                    voucherId: debouncedVoucher || null,
                  })
                }
              >
                Pay for{" "}
                {previewCheckOut
                  ? `Rp ${Number(
                      (previewCheckOut.totalPrice ?? 0)
                    ).toLocaleString("id-ID")}`
                  : "Rp 0,00"}
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
      </Form>
    </div>
  );
};

export default CheckOut;