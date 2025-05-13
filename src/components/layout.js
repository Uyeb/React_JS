import 'antd/dist/reset.css';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import Projects from '../pages/home/Project';
const { Header, Content, Footer } = Layout;
const items = [
  { key: '1', label: 'Contact us' },
  { key: '2', label: 'Management' },
  { key: '3', label: 'Setting' },
  { key: '4', label: 'Language' },
  { key: '5', label: 'Logout' },
];

export function Dashboard(){
    const {
        token: { colorBgContainer, borderRadiusLG },
        } = theme.useToken();
    return (
    <Layout>
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
        />
      </Header>
      <Content style={{ padding: '0 48px' }}>
        <Breadcrumb style={{ margin: '18px 0' }}>
        </Breadcrumb>
        <div
          style={{
            padding: 24,
            minHeight: 480,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
        {/* Nội dung */}
        <Projects/>
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
       
      </Footer>
    </Layout>
  );
}
