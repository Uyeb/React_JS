import axiosClient from '../../api/axiosClient';
import { useRef, useState, useEffect } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import {  Button, Input, Table, theme, Popconfirm, message } from 'antd';
import Highlighter from 'react-highlight-words';
import ProjectModal from './ProjectModal';

export default function Projects() {
  const [filteredInfo, setFilteredInfo] = useState({});
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [items, setItems] = useState([]); 
  const [pagination, setPagination] = useState({ current: 1, pageSize: 20 });
  const [sorter, setSorter] = useState([]);
  const searchInput = useRef(null);
  const {
        token: { colorBgContainer, borderRadiusLG },
        } = theme.useToken();


  const loadProjects = async (searchText = '', page = 1, size = 20, sortList = []) => {
  try {
    const payload = {
      pageNumber: page,
      pageSize: size,
      search: searchText
        ? [
            { key: "name", value: searchText },
            { key: "province", value: searchText },
            { key: "companyName", value: searchText }
          ]
        : [],
      sorts: sortList
    };

    const response = await axiosClient.post('/api/v1/Project/search', payload);
    const listItem = response.data.result.items.map(item => ({
      key: item.id,
      ...item
    }));
    setItems(listItem);

    const totalItems = response.data.result.totalCount;

    console.log('API result:', listItem);

    setPagination({
      current: page,
      pageSize: size,
      total: totalItems, 
    });
  } catch (error) {
    console.error('Lỗi khi lấy danh sách dự án từ API:', error);
  }
};
  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
   setSearchedColumn(''); 
  }, [searchText])

  const handleTableChange = (paginationInfo, filters, sorterInfo) => {
  const page = paginationInfo.current;
  const size = paginationInfo.pageSize;

  setFilteredInfo(filters);

  let sortList = [];
  if (Array.isArray(sorterInfo)) {
    sortList = sorterInfo.map(s => ({
      key: s.field,
      sort: s.order === 'ascend' ? 1 : s.order === 'descend' ? 2 : 0
    }));
  } else if (sorterInfo.field) {
    sortList = [{
      key: sorterInfo.field,
      sort: sorterInfo.order === 'ascend' ? 1 : sorterInfo.order === 'descend' ? 2 : 0
    }];
  }

  setSorter(sortList);
  loadProjects(searchText, page, size, sortList);
};
  // search theo từng cột
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    //setSearchText(selectedKeys[0]);
    //setSearchedColumn(dataIndex);
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
      await axiosClient.post(`/api/v1/Project/delete`,[record.id]);
       message.success('Xóa thành công!');
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
      sorter: true,
      sortDirections: ['descend', 'ascend'],
       filteredValue: filteredInfo.name || null, 
    },
    {
      title: 'Province name ',
      dataIndex: 'province',
      key: 'province',
      width: 300,
      ...getColumnSearchProps('province'),
       sorter: true,
      sortDirections: ['descend', 'ascend'],
      filteredValue: filteredInfo.province || null, 
    },
    {
      title: 'Company name ',
      dataIndex: 'companyName',
      key: 'companyName',
      width: 300,
      ...getColumnSearchProps('companyName'),
      sorter: true,
      sortDirections: ['descend', 'ascend'],
       filteredValue: filteredInfo.companyName || null,
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
            cancelText="không"
            okButtonProps={{
            style: { height: '26px' },
            size: 'middle'
          }}
          cancelButtonProps={{
            style: { height: '26px' },
            size: 'middle'
          }}
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
        style={{ width: 250, marginBottom: 20 }}
        allowClear
        value={searchText}
        onChange={(e) => {
          const value = e.target.value;
          setSearchText(value);
           setFilteredInfo({}); 
           loadProjects(value, 1, pagination.pageSize, sorter);
        } }
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
      <Table
        columns={columns}
        dataSource={items}
        pagination={pagination}
        onChange={handleTableChange}
        scroll={{ x: 900, y: 200 }}
      />
      </div>
    </>

  )
  
}


