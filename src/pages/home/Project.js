
import { useRef, useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import {  Input, Table } from 'antd';
import Highlighter from 'react-highlight-words';
const data = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
  },
  {
    key: '2',
    name: 'Joe Black',
    age: 42,
    address: 'London No. 1 Lake Park',
  },
  {
    key: '3',
    name: 'Jim Green',
    age: 32,
    address: 'Sydney No. 1 Lake Park',
  },
  {
    key: '4',
    name: 'Jim Red',
    age: 32,
    address: 'London No. 2 Lake Park',
  },
];


export default function Projects() {

  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
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
    Object.assign(
      Object.assign(
        { title: 'Project name', dataIndex: 'name', key: 'name', width: '30%' },
        getColumnSearchProps('name'),
      ),
      {
        sorter: (a, b) => a.name.length - b.name.length,
        sortDirections: ['descend', 'ascend'],
      },
    ), 
    Object.assign(
      Object.assign(
        { title: 'Age', dataIndex: 'age', key: 'age', width: '20%' },
        getColumnSearchProps('age'),
        ),
        {
          sorter: (a, b) => a.age - b.age,
          sortDirections: ['descend', 'ascend'],
        },
    ),
    Object.assign(
      Object.assign(
        { title: 'Address', dataIndex: 'address', key: 'address' },
        getColumnSearchProps('address'),
      ),
      {
        sorter: (a, b) => a.address.length - b.address.length,
        sortDirections: ['descend', 'ascend'],
      },
    ),
  ];

  return <Table columns={columns} dataSource={data} />;
}


