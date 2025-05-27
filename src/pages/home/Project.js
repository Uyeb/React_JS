import axiosClient from "../../api/axiosClient";
import { useRef, useState, useEffect } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { Button, Input, Table, theme, Popconfirm, message } from "antd";
import ProjectModal from "./ProjectModal";

export default function Projects() {
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 20 });
  const [sorter, setSorter] = useState([]);
  const [filteredInfo, setFilteredInfo] = useState({});
  const [searchText, setSearchText] = useState("");
  const [searchTextColumn, setSearchTextColumn] = useState({});
  const searchInput = useRef(null);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const loadProjects = async (
    globalSearch = "",
    page = 1,
    size = 20,
    sortList = sorter,
    filters = []
  ) => {
    try {
      const payload = {
        pageNumber: page,
        pageSize: size,
        search: globalSearch
          ? [
              { key: "name", value: globalSearch },
              { key: "province", value: globalSearch },
              { key: "companyName", value: globalSearch },
            ]
          : filters,
        sort: sortList,
      };

      const { data } = await axiosClient.post(
        "/api/v1/Project/search",
        payload
      );
      const listItem = data.result.items.map((item) => ({
        key: item.id,
        ...item,
      }));

      setItems(listItem);
      setPagination((prev) => ({
        ...prev,
        current: page,
        pageSize: size,
        total: data.result.totalCount,
      }));
    } catch (error) {
      console.error("Error loading projects:", error);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleTableChange = (paginationInfo, filters, sorterInfo) => {
    const page = paginationInfo.current;
    const size = paginationInfo.pageSize;
    let newSorter = [];
    
    if (Array.isArray(sorterInfo)) {
      newSorter = sorterInfo.map((s) => ({
        key: s.field,
        sort: s.order === "ascend" ? 1 : s.order === "descend" ? 2 : 0,
      }));
    } else if (sorterInfo.field) {
      newSorter = [
        {
          key: sorterInfo.field,
          sort:
            sorterInfo.order === "ascend"
              ? 1
              : sorterInfo.order === "descend"
                ? 2
                : 0,
        },
      ];
    }

    setSorter(newSorter);

    const columnFilters = Object.entries(searchTextColumn)
      .filter(([_, val]) => val)
      .map(([key, value]) => ({ key, value }));

    loadProjects(searchText, page, size, newSorter, columnFilters);
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    const value = selectedKeys[0] || "";
    const updatedSearch = { ...searchTextColumn, [dataIndex]: value };

    setSearchTextColumn(updatedSearch);
    setSearchText(""); // Reset global search

    const filters = Object.entries(updatedSearch)
      .filter(([_, val]) => val)
      .map(([key, value]) => ({ key, value }));

    loadProjects("", 1, pagination.pageSize, sorter, filters);
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
        />
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
    ),
    filterDropdownProps: {
      onOpenChange: (open) => {
        if (open) {
          setTimeout(() => searchInput.current?.select(), 100);
        }
      },
    },
    render: (text) => text,
  });

  const handleDelete = async (record) => {
    if (!record?.id) return message.error("Missing project ID to delete");

    try {
      await axiosClient.post(`/api/v1/Project/delete`, [record.id]);
      message.success("Deleted successfully!");
      loadProjects(
        searchText,
        pagination.current,
        pagination.pageSize,
        sorter,
        []
      );
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const columns = [
    {
      title: "Project name",
      dataIndex: "name",
      key: "name",
      width: 300,
      ...getColumnSearchProps("name"),
      sorter: true,
      sortDirections: ["descend", "ascend"],
      filteredValue: filteredInfo.name || null,
    },
    {
      title: "Province",
      dataIndex: "province",
      key: "province",
      width: 300,
      ...getColumnSearchProps("province"),
      sorter: true,
      sortDirections: ["descend", "ascend"],
      filteredValue: filteredInfo.province || null,
    },
    {
      title: "Company",
      dataIndex: "companyName",
      key: "companyName",
      width: 300,
      ...getColumnSearchProps("companyName"),
      sorter: true,
      sortDirections: ["descend", "ascend"],
      filteredValue: filteredInfo.companyName || null,
    },
    {
      title: "",
      key: "actions",
      width: 300,
      render: (record) => (
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <ProjectModal
            mode="edit"
            project={record}
            onProjectChanged={() =>
              loadProjects(
                searchText,
                pagination.current,
                pagination.pageSize,
                sorter,
                []
              )
            }
            buttonStyle={{ height: 36 }}
          />
          <Popconfirm
            title="Are you sure to delete this project?"
            onConfirm={() => handleDelete(record)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger style={{ height: 36, width: "150" }}>
              Delete
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          margin: "1rem 0",
        }}
      >
        <h2 style={{ margin: 0 }}>List Project</h2>
        <ProjectModal
          mode="create"
          onProjectChanged={() =>
            loadProjects(
              searchText,
              pagination.current,
              pagination.pageSize,
              sorter,
              []
            )
          }
          buttonStyle={{ height: 36, width: 130 }}
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
          setSearchTextColumn({});
          setFilteredInfo({});
          loadProjects(value, 1, pagination.pageSize, sorter, []);
        }}
      />

      <div
        style={{
          background: colorBgContainer,
          minHeight: 280,
          padding: 24,
          borderRadius: borderRadiusLG,
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
  );
}
