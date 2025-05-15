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
  const [items, setItems] = useState([]); 
  const searchInput = useRef(null);
  const {
        token: { colorBgContainer, borderRadiusLG },
        } = theme.useToken();

  const loadProjects = async () => {
    try {
      const response = await axios.get('/api/v1/Project',{
        headers: {
          Authorization: " Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImQyNWJkYjFjLTU4MmItNGMyYy1hODc1LTMxYzJlODViZDU2NyIsImZpcnN0TmFtZSI6IkFkbWluIiwibGFzdE5hbWUiOiJNYWxtZSIsImVtYWlsIjoiYWRtaW5AbWFsbWUubmV0IiwidXNlcm5hbWUiOiJhZG1pbkBtYWxtZS5uZXQiLCJyb2xlIjoiYWRtaW4iLCJuYmYiOjE3NDcyNzg5MjAsImV4cCI6MTc0NzMwODkyMCwiaWF0IjoxNzQ3Mjc4OTIwLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjU1MDAiLCJhdWQiOiJodHRwOi8vbG9jYWxob3N0OjU1MDAifQ.V8Ed6bdP2TaBROC0nhjGMpW8ncBa26BoZbWqrrEc2xU "
        }
      });
      console.log("Raw API response:", response.data)
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
      title: 'province ',
      dataIndex: 'province',
      key: 'province',
      width: 300,
      ...getColumnSearchProps('province'),
      sorter: (a, b) => a.province.length - b.province.length,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'companyName ',
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
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
          {/* <EditProject onProject={record} onProjectCreated={loadProjects}/>
          <Button type="default" >Delete</Button> */}
          
        </div>
      ),
    },
    
  ];

  return (
   <>
      {/* <CreateProject onProjectCreated={loadProjects}/> */}
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


