"use client"
import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Row, Col, message } from 'antd';
import { MailOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const ResetPassword: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const onFinish = (values: any) => {
    console.log('Received values of form: ', values);
    // Burada normalde bir API çağrısı yapılır
    setIsSubmitted(true);
    message.success('E-posta adresinize bir bağlantı gönderdik.');
  };

  if (isSubmitted) {
    return (
      <Row justify="center" align="middle" style={{ minHeight: '100vh' }}>
        <Col xs={22} sm={16} md={12} lg={8} xl={6}>
          <Card>
            <Title level={2} style={{ textAlign: 'center', marginBottom: 24 }}>Şifre Sıfırlama</Title>
            <Text style={{ display: 'block', textAlign: 'center' }}>
              E-posta adresinize bir şifre sıfırlama bağlantısı gönderdik. Lütfen gelen kutunuzu kontrol edin.
            </Text>
          </Card>
        </Col>
      </Row>
    );
  }

  return (
    <Row justify="center" align="middle" style={{ minHeight: '100vh' }}>
      <Col xs={22} sm={16} md={12} lg={8} xl={6}>
        <Card>
          <Title level={2} style={{ textAlign: 'center', marginBottom: 24 }}>Şifre Sıfırlama</Title>
          <Form
            name="reset_password"
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

            <Form.Item>
              <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                Şifre Sıfırlama Bağlantısı Gönder
              </Button>
            </Form.Item>
            <Form.Item>
              <Text style={{ display: 'block', textAlign: 'center' }}>
                Giriş sayfasına dön? <a href="/sign-in">Giriş yap</a>
              </Text>
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

export default ResetPassword;
