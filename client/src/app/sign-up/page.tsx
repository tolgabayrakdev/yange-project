"use client";
import React from 'react';
import { TextInput, PasswordInput, Button, Paper, Title, Text, Container, Box } from '@mantine/core';
import { useForm } from '@mantine/form';
import Link from 'next/link';

export default function SignUp() {
    const form = useForm({
        initialValues: {
            email: '',
            username: '',
            password: '',
            confirmPassword: '',
        },
        validate: {
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Geçersiz e-posta adresi'),
            username: (value) => (value.length < 3 ? 'Kullanıcı adı en az 3 karakter olmalıdır' : null),
            password: (value) => (value.length < 6 ? 'Şifre en az 6 karakter olmalıdır' : null),
            confirmPassword: (value, values) =>
                value !== values.password ? 'Şifreler eşleşmiyor' : null,
        },
    });

    const handleSubmit = (values: typeof form.values) => {
        // Burada kayıt işlemlerinizi gerçekleştirebilirsiniz
        console.log('Register attempt with:', values);
    };

    return (
        <Container size={420} my={40}>
            <Box ta="center" mb={20}>
                <Title
                >
                    Yeni Hesap Oluştur
                </Title>
                <Text c="dimmed" size="sm" mt={5}>
                    Zaten hesabınız var mı?{' '}
                    <Text component={Link} href="sign-in" size="sm" c="blue">
                        Giriş yap
                    </Text>
                </Text>
            </Box>

            <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <TextInput
                        label="Kullanıcı Adı"
                        placeholder="deneme123"
                        required
                        {...form.getInputProps('username')}
                    />
                    <TextInput
                        label="E-posta"
                        placeholder="ornek@mail.com"
                        required
                        mt="md"
                        {...form.getInputProps('email')}
                    />

                    <PasswordInput
                        label="Şifre"
                        placeholder="Şifreniz"
                        required
                        mt="md"
                        {...form.getInputProps('password')}
                    />
                    <PasswordInput
                        label="Şifre Onayı"
                        placeholder="Şifrenizi tekrar girin"
                        required
                        mt="md"
                        {...form.getInputProps('confirmPassword')}
                    />
                    <Button fullWidth mt="xl" type="submit">
                        Kayıt Ol
                    </Button>
                </form>
            </Paper>
        </Container>
    );
}