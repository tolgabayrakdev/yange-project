"use client"
import React from 'react';
import { Form, Input, Button, Card, Typography, Row, Col } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const SignUp: React.FC = () => {
  const onFinish = (values: any) => {
    console.log('Received values of form: ', values);
  };

  return (
    <Row justify="center" align="middle" style={{ minHeight: '100vh' }}>
      <Col xs={22} sm={16} md={12} lg={8} xl={6}>
        <Card>
          <Title level={2} style={{ textAlign: 'center', marginBottom: 24 }}>Kayıt Ol</Title>
          <Form
            name="register"
            onFinish={onFinish}
            scrollToFirstError
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: 'Lütfen kullanıcı adınızı girin!', whitespace: true }]}
            >
              <Input prefix={<UserOutlined />} placeholder="Kullanıcı Adı" />
            </Form.Item>

            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Lütfen e-posta adresinizi girin!' },
                { type: 'email', message: 'Geçerli bir e-posta adresi girin!' }
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder="E-posta" />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: 'Lütfen şifrenizi girin!' },
                { min: 6, message: 'Şifre en az 6 karakter olmalıdır!' }
              ]}
              hasFeedback
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Şifre" />
            </Form.Item>

            <Form.Item
              name="confirm"
              dependencies={['password']}
              hasFeedback
              rules={[
                { required: true, message: 'Lütfen şifrenizi onaylayın!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('İki şifre eşleşmiyor!'));
                  },
                }),
              ]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Şifreyi Onayla" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                Kayıt Ol
              </Button>
            </Form.Item>
            <Form.Item>
              <Text style={{ display: 'block', textAlign: 'center' }}>
                Zaten hesabınız var mı? <a href="/sign-in">Giriş yap</a>
              </Text>
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

export default SignUp;
