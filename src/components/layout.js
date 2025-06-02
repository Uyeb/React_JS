import 'antd/dist/reset.css';
import { Layout, Menu, theme,  message } from 'antd';
import Projects from '../pages/home/Project';
import { useNavigate } from 'react-router-dom';

const { Header, Content, Footer } = Layout;

const items = [
  { key: '1', label: 'Contact us' },
  { key: '2', label: 'Management' },
  { key: '3', label: 'Setting' },
  { key: '4', label: 'Language' },
  { key: '5', label: 'Logout' },
];

export function Dashboard() {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();


  //Logout
  const navigate = useNavigate(); // Hook để điều hướng

  // Hàm xử lý sự kiện khi người dùng chọn một mục trong menu
  const handleMenuClick = ({ key }) => {
    if (key === '5') { // Key của mục "Logout"
      // Gọi hàm đăng xuất
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      message.success('Đăng xuất thành công!');
      navigate('/sign-in');
    }
  };

  return (
    <Layout style={{ height: '100vh' }}>
      <Header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 1,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div className="demo-logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          items={items}
          style={{ flex: 1, minWidth: 0 }}
          onClick={handleMenuClick}
        />
      </Header>

      <Content style={{ padding: '16px 24px', flex: 1 }}>
        <div
          style={{
            background: colorBgContainer,
            height: '100%',
            padding: 16,
            borderRadius: borderRadiusLG,
          }}
        >
          <Projects />
        </div>
      </Content>

      <Footer style={{ background: colorBgContainer, textAlign: 'center' }}>
        Ant Design ©{new Date().getFullYear()} Created by Ant UED
      </Footer>
    </Layout>
  );
}
