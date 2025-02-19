import React, { useEffect, useState } from "react";
import { Button, Row, Space, Table, Modal, Form, Input, Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, updateUser } from "../redux/userSlice";
import { EditOutlined } from "@ant-design/icons";
import axios from "axios";
import Swal from "sweetalert2";
import Search from "antd/es/input/Search";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

export const UserList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list: users, loading } = useSelector((state) => state.users);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [form] = Form.useForm();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: users.length,
  });

  useEffect(() => {
    dispatch(fetchUsers());
    getStateData();
  }, [dispatch]);

  useEffect(() => {
    setFilteredUsers(users);
    setPagination((prev) => ({ ...prev, total: users.length }));
  }, [users]);

  const getStateData = async () => {
    try {
      const response = await axios.get(
        "https://speedsoftware.site/administrator/InterviewApi/getStates"
      );
      setStates(response.data.data || []);
    } catch (error) {
      Swal.fire("Error", "Failed to fetch states", "error");
    }
  };

  const getCityData = async (state_id) => {
    try {
      const response = await axios.post(
        "https://speedsoftware.site/administrator/InterviewApi/getCities",
        { state_id }
      );
      setCities(response.data.data || []);
    } catch (error) {
      Swal.fire("Error", "Failed to fetch cities", "error");
    }
  };

  const handleEdit = async (user) => {
    setEditingUser(user);
    form.setFieldsValue({
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      roleId: user.roleId,
      status: user.status,
      stateId: user.stateId,
      cityId: user.cityId,
    });
    await getCityData(user.stateId);
    setIsModalOpen(true);
  };

  const handleUpdateUser = async (values) => {
    if (!editingUser) {
      Swal.fire("Error", "No user selected for update", "error");
      return;
    }

    const updatedUser = {
      ...editingUser,
      ...values,
      userId: editingUser.userId,
    };

    try {
      const response = await dispatch(updateUser(updatedUser)).unwrap();
      Swal.fire(
        "Success",
        response.message || "User updated successfully!",
        "success"
      );
      setIsModalOpen(false);
      dispatch(fetchUsers());
    } catch (error) {
      Swal.fire("Error", "Failed to update user", "error");
    }
  };

  const handleSearch = (value) => {
    const searchText = value.toLowerCase();
    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchText) ||
        user.email.toLowerCase().includes(searchText) ||
        user.mobile.includes(searchText)
    );
    setFilteredUsers(filtered);
    setPagination((prev) => ({ ...prev, total: filtered.length }));
  };

  const handleTableChange = (pagination) => {
    setPagination(pagination);
  };

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Mobile", dataIndex: "mobile", key: "mobile" },
    {
      title: "Role",
      dataIndex: "roleId",
      key: "roleId",
      render: (role) => (role === 1 ? "User" : "Admin"),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (status === 1 ? "Inactive" : "Active"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="ghost"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2>Users List</h2>
      <Row justify="space-between">
        <Search
          placeholder="Search by Name, Email, or Mobile"
          allowClear
          onSearch={handleSearch}
          style={{ width: 300 }}
        />
        <Button type="primary" onClick={() => navigate("/register")}>
          Add User
        </Button>
      </Row>
      <Table
        columns={columns}
        dataSource={filteredUsers}
        loading={loading}
        rowKey="userId"
        pagination={pagination}
        onChange={handleTableChange}
      />

      <Modal
        title="Edit User"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleUpdateUser}>
          <Form.Item
            name="name"
            label="Full Name"
            rules={[{ required: true, message: "Please enter your full name" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="mobile"
            label="Mobile"
            rules={[
              { required: true, message: "Please enter your mobile number" },
              {
                pattern: /^\d{10}$/,
                message: "Enter a valid 10-digit mobile number",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="roleId"
            label="Role"
            rules={[{ required: true, message: "Please select a role" }]}
          >
            <Select
              placeholder="Select role"
              defaultValue={editingUser?.roleId}
            >
              <Option value={1}>User</Option>
              <Option value={2}>Admin</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="stateId"
            label="State"
            rules={[{ required: true, message: "Please select a state" }]}
          >
            <Select
              placeholder="Select state"
              onChange={async (value) => {
                form.setFieldsValue({ cityId: "" });
                await getCityData(value);
              }}
            >
              {states.map((s) => (
                <Option key={s.id} value={s.id}>
                  {s.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="cityId"
            label="City"
            rules={[{ required: true, message: "Please select a city" }]}
          >
            <Select placeholder="Select city">
              {cities.map((c) => (
                <Option key={c.id} value={c.id}>
                  {c.city}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: "Please select a status" }]}
          >
            <Select
              placeholder="Select status"
              defaultValue={editingUser?.status}
            >
              <Option value={1}>Inactive</Option>
              <Option value={2}>Active</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Update User
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
