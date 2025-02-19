import React, { useState } from "react";
import { Form, Input, Button, Card, Row } from "antd";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post(
        "https://speedsoftware.site/administrator/InterviewApi/login",
        {
          username: values.username,
          password: values.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          mode: "cors",
          withCredentials: true,
        }
      );

      if (response.data.success) {
        Swal.fire(
          "Success",
          response.data.message || "Login successful!",
          "success"
        );
        localStorage.setItem("user", JSON.stringify(response.data.user));
        navigate("/users");
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text:
            response?.data?.message || "Invalid credentials, please try again!",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error?.message || "Login failed. Please check your credentials.",
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
      <Card
        title={
          <Row justify="space-between">
            <h3>Login</h3>
            <img src="/login-logo.png" alt="login" />
          </Row>
        }
        style={{ width: 350 }}
      >
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="username"
            label="Username or Email"
            rules={[
              {
                required: true,
                message: "Please enter your username or email",
              },
            ]}
          >
            <Input placeholder="Enter username or email" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password placeholder="Enter password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Login
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
