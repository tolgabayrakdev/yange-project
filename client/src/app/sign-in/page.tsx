"use client"
import React from 'react';
import { Form, Input, Button, Checkbox, Card, Typography, Row, Col } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const SignIn: React.FC = () => {
  const onFinish = (values: any) => {
    console.log('Received values of form: ', values);
  };

  return (
    <Row justify="center" align="middle" style={{ minHeight: '100vh' }}>
      <Col xs={22} sm={16} md={12} lg={8} xl={6}>
        <Card>
          <Title level={2} style={{ textAlign: 'center', marginBottom: 24 }}>Giriş Yap</Title>
          <Form
            name="normal_login"
            initialValues={{ remember: true }}
            onFinish={onFinish}
          >
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
              rules={[{ required: true, message: 'Lütfen şifrenizi girin!' }]}
            >
              <Input
                prefix={<LockOutlined />}
                type="password"
                placeholder="Şifre"
              />
            </Form.Item>
            <Form.Item>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Beni hatırla</Checkbox>
              </Form.Item>

              <a style={{ float: 'right' }} href="/reset-password">
                Şifremi unuttum
              </a>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                Giriş Yap
              </Button>
            </Form.Item>
            <Form.Item>
              <Text style={{ display: 'block', textAlign: 'center' }}>
                Hesabınız yok mu? <a href="/sign-up">Şimdi kayıt ol!</a>
              </Text>
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

export default SignIn;