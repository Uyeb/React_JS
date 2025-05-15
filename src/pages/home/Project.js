import axios from 'axios';
import { useRef, useState, useEffect } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import {  Button, Input, Table, theme, Popconfirm } from 'antd';
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
          'Content-Type': 'application/json',
          Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImQyNWJkYjFjLTU4MmItNGMyYy1hODc1LTMxYzJlODViZDU2NyIsImZpcnN0TmFtZSI6IkFkbWluIiwibGFzdE5hbWUiOiJNYWxtZSIsImVtYWlsIjoiYWRtaW5AbWFsbWUubmV0IiwidXNlcm5hbWUiOiJhZG1pbkBtYWxtZS5uZXQiLCJyb2xlIjoiYWRtaW4iLCJuYmYiOjE3NDcyOTA0OTcsImV4cCI6MTc0NzMyMDQ5NywiaWF0IjoxNzQ3MjkwNDk3LCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjU1MDAiLCJhdWQiOiJodHRwOi8vbG9jYWxob3N0OjU1MDAifQ.BBvxHt-3ICk_hb_Cgdcd-eU_D659arjedJwOiM8Ex2U"
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


  
  const handleDelete = async (record) => {
    if (!record?.id) {
      console.error('Không tìm thấy ID project để xóa');
      return;
    }

    try {
      await axios.post(`/api/v1/Project/delete`,[record.id], {
        headers: {
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImQyNWJkYjFjLTU4MmItNGMyYy1hODc1LTMxYzJlODViZDU2NyIsImZpcnN0TmFtZSI6IkFkbWluIiwibGFzdE5hbWUiOiJNYWxtZSIsImVtYWlsIjoiYWRtaW5AbWFsbWUubmV0IiwidXNlcm5hbWUiOiJhZG1pbkBtYWxtZS5uZXQiLCJyb2xlIjoiYWRtaW4iLCJuYmYiOjE3NDcyOTA0OTcsImV4cCI6MTc0NzMyMDQ5NywiaWF0IjoxNzQ3MjkwNDk3LCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjU1MDAiLCJhdWQiOiJodHRwOi8vbG9jYWxob3N0OjU1MDAifQ.BBvxHt-3ICk_hb_Cgdcd-eU_D659arjedJwOiM8Ex2U'
        }
      });
      // Sau khi xóa xong, tải lại dữ liệu
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
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
          <EditProject onProject={record} onProjectCreated={loadProjects}/>
          
           <Popconfirm
              title="Bạn có chắc muốn xóa project này?"
              onConfirm={() => handleDelete(record)}  // <-- truyền record vào đây
              okText="Có"
              cancelText="Không"
            >
              <Button type="default">Delete</Button>
            </Popconfirm>
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
        <Table columns={columns} dataSource={items} scroll={{ x: 900, y: 200 }}/>
      </div>
    
   </>

  )
  
}


