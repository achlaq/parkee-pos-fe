import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import '../styles/sidebar.scss';
import logoImage from '../assets/logo.png';
import { MENU_ITEMS } from '../constants/menuItems';
import { Link } from 'react-router-dom';

const Sidebar = ({ collapsed, toggleSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>

      <div className={`logo ${collapsed ? 'collapsed' : ''}`}>
        <img src={logoImage} alt="Logo" />
      </div>

      <ul>
        {MENU_ITEMS.map((item) => (
            <Link to={item.path} key={item.path}>
                <li className={`${collapsed ? 'collapsed' : ''} ${location.pathname === item.path ? 'active' : ''}`}>
                    <Button
                        type="text"
                        icon={item.icon}
                        style={{ color: 'white', width: '100%', textAlign: 'center' }}
                    >
                    {!collapsed && item.label}
                    </Button>
                </li>
            </Link>
        ))}
      </ul>

      <div className="sidebar-footer">
        {!collapsed && <h2>Menu</h2>}
        <Button type="text" onClick={toggleSidebar} style={{ color: '#fff' }}>
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
