import React, { useEffect, useState } from "react";
import { Form, Input, Select, Button, Card, message } from "antd";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchUsers } from "../../redux/userSlice";

const { Option } = Select;

const Register = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getStateData();
  }, []);

  const getStateData = async () => {
    try {
      const response = await axios.get(
        "https://speedsoftware.site/administrator/InterviewApi/getStates"
      );
      setStates(response?.data?.data);
    } catch (error) {
      message.error("Error fetching states");
    }
  };

  const getCityData = async (state_id) => {
    try {
      const response = await axios.post(
        "https://speedsoftware.site/administrator/InterviewApi/getCities",
        { state_id }
      );
      setCities(response?.data?.data);
    } catch (error) {
      message.error("Error fetching cities");
    }
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post(
        "https://speedsoftware.site/administrator/InterviewApi/addUser",
        {
          name: values.name,
          email: values.email,
          mobile: values.mobile,
          password: values.password,
          stateId: values.state_id,
          cityId: values.city_id,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.status === 200) {
        Swal.fire(
          "Success",
          response.data.message || "User registered successfully!",
          "success"
        );
        form.resetFields();
        navigate("/users");
        dispatch(fetchUsers());
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: response?.data?.message || "Registration failed",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error?.message || "Error registering user",
      });
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Card title="Register" style={{ width: 400 }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            name="name"
            label="Full Name"
            rules={[{ required: true, message: "Please enter your name" }]}
          >
            <Input placeholder="Enter full name" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, type: "email", message: "Enter a valid email" },
            ]}
          >
            <Input placeholder="Enter email" />
          </Form.Item>

          <Form.Item
            name="mobile"
            label="Mobile"
            rules={[
              {
                required: true,
                pattern: /^\d{10}$/,
                message: "Enter a valid 10-digit mobile number",
              },
            ]}
          >
            <Input placeholder="Enter mobile number" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[
              {
                required: true,
                min: 6,
                message: "Password must be at least 6 characters",
              },
            ]}
          >
            <Input.Password placeholder="Enter password" />
          </Form.Item>

          <Form.Item
            name="state_id"
            label="State"
            rules={[{ required: true, message: "Please select a state" }]}
          >
            <Select placeholder="Select state" onChange={getCityData}>
              {states.map((state) => (
                <Option key={state.id} value={state.id}>
                  {state.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="city_id"
            label="City"
            rules={[{ required: true, message: "Please select a city" }]}
          >
            <Select placeholder="Select city">
              {cities.map((city) => (
                <Option key={city.id} value={city.id}>
                  {city.city}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Register
            </Button>
            <Button
              type="text"
              block
              loading={loading}
              onClick={() => navigate(-1)}
            >
              Back
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Register;
