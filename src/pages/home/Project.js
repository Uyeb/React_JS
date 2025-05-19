import axios from 'axios';
import { useRef, useState, useEffect } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import {  Button, Input, Table, theme, Popconfirm } from 'antd';
import Highlighter from 'react-highlight-words';
import ProjectModal from './ProjectModal';

export default function Projects() {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [items, setItems] = useState([]); 
  const searchInput = useRef(null);
  const {
        token: { colorBgContainer, borderRadiusLG },
        } = theme.useToken();

  const accessToken = process.env.REACT_APP_ACCESS_TOKEN;

  const loadProjects = async () => {
    try {
      const response = await axios.get('/api/v1/Project',{
        headers: {
          'Content-Type': 'application/json',
          Authorization: accessToken,
        }
      });
      const listItem = response.data.result.items.map(item => ({
        key: item.id,
        ...item
      }));
      setItems(listItem);
      console.log("Formatted data table:", listItem);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách dự án từ API:', error);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
      <div style={{ padding: 8 }} onKeyDown={e => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
      </div>
    ),
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />,
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    filterDropdownProps: {
      onOpenChange(open) {
        if (open) {
          setTimeout(() => {
            searchInput.current?.select();
          }, 100);
        } 

      },
    },
    render: text =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });


  // Xóa project
  const handleDelete = async (record) => {
    if (!record?.id) {
      console.error('Không tìm thấy ID project để xóa');
      return;
    }

    try {
      await axios.post(`/api/v1/Project/delete`,[record.id], {
        headers: {
          Authorization: accessToken,
        }
      });
      
      loadProjects();
    } catch (error) {
      console.error('Lỗi khi xóa project:', error);
    }
  };


  const columns = [
    {
      title: 'Project name',
      dataIndex: 'name',
      key: 'name',
      width: 300,
      ...getColumnSearchProps('name'),
      sorter: (a, b) => a.name.length - b.name.length,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Province name ',
      dataIndex: 'province',
      key: 'province',
      width: 300,
      ...getColumnSearchProps('province'),
      sorter: (a, b) => a.province.length - b.province.length,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Company name ',
      dataIndex: 'companyName',
      key: 'companyName',
      width: 300,
      ...getColumnSearchProps('companyName'),
      sorter: (a, b) => a.companyName.length - b.companyName.length,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: '',
      key: 'actions',
      width: 300,
      render: (record) => (
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', width: '220px' }}>
          <ProjectModal
            mode="edit"
            project={record}
            onProjectChanged={loadProjects}
            buttonStyle={{ height: '36px', width: '100%' }}
          />

          <Popconfirm
            title="Bạn có chắc muốn xóa project này?"
            onConfirm={() => handleDelete(record)}
            okText="Có"
            cancelText="Không"
          >
            <Button type="default" style={{ height: '36px', width: '100%' }}>
              Delete
            </Button>
          </Popconfirm>
        </div>
      ),
    },
    
  ];

  return (
   <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '1rem 0' }}>
        <h2 style={{ margin: 0 }}>List Project</h2>
        <ProjectModal
          mode="create"
          onProjectChanged={loadProjects}
          buttonStyle={{ height: '36px', width: '130px' }}
        />
      </div>

      <Input
        placeholder="Search"
        style={{ width: 250, marginBottom: 20,}}
        allowClear
      />
      
      <div
      style={{
            background: colorBgContainer,
            minHeight: 280,
            padding: 24,
            borderRadius: borderRadiusLG,
            overflow: 'auto',
          }}
      >
        <Table columns={columns} dataSource={items} scroll={{ x: 900, y: 200 }}/>
      </div>
    
   </>

  )
  
}


