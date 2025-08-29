import { HomeOutlined, LoginOutlined, LogoutOutlined } from '@ant-design/icons';

export const MENU_ITEMS = [
  { icon: <HomeOutlined />, label: 'Dashboard', path: '/' },
  { icon: <LoginOutlined />, label: 'Check In', path: '/checkin' },
  { icon: <LogoutOutlined />, label: 'Check Out', path: '/checkout' },
];
