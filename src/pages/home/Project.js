import axios from 'axios';
import { useRef, useState, useEffect } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import {  Button, Input, Table, theme } from 'antd';
import Highlighter from 'react-highlight-words';
import CreateProject from './CreatProject';
import EditProject from './EditProject';

export default function Projects() {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [data, setData] = useState([]); 
  const searchInput = useRef(null);
  const {
        token: { colorBgContainer, borderRadiusLG },
        } = theme.useToken();

  const loadProjects = async () => {
    try {
      const response = await axios.get('http://localhost:3001/data');
      const listData = response.data.map(item => ({
        key: item.id,
        ...item
      }));
      setData(listData);
      console.log("Formatted data table:", listData);
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
      title: 'Age ',
      dataIndex: 'age',
      key: 'age',
      width: 300,
      ...getColumnSearchProps('age'),
      sorter: (a, b) => a.age - b.age,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Address ',
      dataIndex: 'address',
      key: 'address',
      width: 300,
      ...getColumnSearchProps('address'),
      sorter: (a, b) => a.address.length - b.address.length,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: '',
      key: 'actions',
      width: 300,
      render: (record) => (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
          <EditProject onProject={record} onProjectCreated={loadProjects}/>
          <Button type="default" >Delete</Button>
          
        </div>
      ),
    },
    
  ];

  return (
   <>
      <CreateProject onProjectCreated={loadProjects}/>
      <div
      style={{
            background: colorBgContainer,
            minHeight: 280,
            padding: 24,
            borderRadius: borderRadiusLG,
            overflow: 'auto',
          }}
      >
        <Table columns={columns} dataSource={data} scroll={{ x: 900, y: 200 }}/>
      </div>
    
   </>

  )
  
}


