"use client";
import React from 'react';
import { TextInput, PasswordInput, Button, Paper, Title, Text, Container, Box, Checkbox } from '@mantine/core';
import { useForm } from '@mantine/form';
import Link from 'next/link';

export default function SignIn() {
  const form = useForm({
    initialValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Geçersiz e-posta adresi'),
      password: (value) => (value.length < 1 ? 'Şifre gereklidir' : null),
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    // Burada giriş işlemlerinizi gerçekleştirebilirsiniz
    console.log('Signin attempt with:', values);
  };

  return (
    <Container size={420} my={40}>
      <Box ta="center" mb={20}>
        <Title
        >
          Hesabınıza Giriş Yapın
        </Title>
        <Text c="dimmed" size="sm" mt={5}>
          Hesabınız yok mu?{' '}
          <Text component={Link} href="sign-up" size="sm" c="blue">
            Hesap oluştur
          </Text>
        </Text>
      </Box>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            label="E-posta"
            placeholder="ornek@mail.com"
            required
            {...form.getInputProps('email')}
          />
          <PasswordInput
            label="Şifre"
            placeholder="Şifreniz"
            required
            mt="md"
            {...form.getInputProps('password')}
          />
          <Box mt="md" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Checkbox
              label="Beni hatırla"
              {...form.getInputProps('rememberMe', { type: 'checkbox' })}
            />
            <Text component="a" href="#" size="sm" c="blue">
              Şifremi unuttum
            </Text>
          </Box>
          <Button fullWidth mt="xl" type="submit">
            Giriş Yap
          </Button>
        </form>
      </Paper>
    </Container>
  );
}