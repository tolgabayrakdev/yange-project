import { Box, Button, FormControl, FormLabel, Input, VStack, Heading, Text, Link, FormErrorMessage, useToast } from "@chakra-ui/react";
import { Formik, Form, Field, FieldProps } from "formik";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";

const SignUpSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, "Kullanıcı adı en az 3 karakter olmalıdır")
    .required("Kullanıcı adı gereklidir"),
  email: Yup.string()
    .email("Geçersiz e-posta adresi")
    .required("E-posta adresi gereklidir"),
  password: Yup.string()
    .min(6, "Şifre en az 6 karakter olmalıdır")
    .matches(/[A-Z]/, "Şifre en az bir büyük harf içermelidir")
    .matches(/\d/, "Şifre en az bir rakam içermelidir")
    .required("Şifre gereklidir"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Şifreler eşleşmiyor')
    .required("Şifre onayı gereklidir"),
});

export default function SignUp() {
  const navigate = useNavigate();
  const toast = useToast();

  return (
    <Box maxWidth="350px" margin="auto" mt={6}>
      <Formik
        initialValues={{ username: "", email: "", password: "", confirmPassword: "" }}
        validationSchema={SignUpSchema}
        onSubmit={async (values, actions) => {
          try {
            const response = await fetch(import.meta.env.VITE_BACKEND_URL + '/api/auth/register', {
              method: 'POST',
              credentials: "include",
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                username: values.username,
                email: values.email,
                password: values.password,
              }),
            });

            if (response.status === 201) {
              toast({
                title: "Kayıt başarılı",
                description: "Hesabınız oluşturuldu. Giriş yapabilirsiniz.",
                status: "success",
                duration: 3000,
                isClosable: true,
              });
              setTimeout(() => navigate('/sign-in'), 500);
            } else {
              const errorData = await response.json();
              if (errorData.detail) {
                if (Array.isArray(errorData.detail)) {
                  let errorMessages = errorData.detail.map((error: any) => error.msg).join('\n');
                  toast({
                    title: "Kayıt başarısız",
                    description: errorMessages,
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                  });
                } else {
                  toast({
                    title: "Kayıt başarısız",
                    description: errorData.detail,
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                  });
                }
              } else {
                throw new Error('Kayıt başarısız');
              }
            }
          } catch (error) {
            toast({
              title: "Kayıt başarısız",
              description: "Lütfen bilgilerinizi kontrol edip tekrar deneyiniz.",
              status: "error",
              duration: 3000,
              isClosable: true,
            });
          } finally {
            actions.setSubmitting(false);
          }
        }}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form>
            <VStack spacing={3} align="stretch">
              <Heading as="h1" size="lg" textAlign="center">Hesap Oluştur</Heading>

              <Field name="username">
                {({ field }: FieldProps) => (
                  <FormControl isInvalid={!!(errors.username && touched.username)}>
                    <FormLabel fontSize="sm">Kullanıcı Adı</FormLabel>
                    <Input {...field} type="text" placeholder="Kullanıcı adınızı girin" size="sm" />
                    <FormErrorMessage fontSize="xs">{errors.username}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>

              <Field name="email">
                {({ field }: FieldProps) => (
                  <FormControl isInvalid={!!(errors.email && touched.email)}>
                    <FormLabel fontSize="sm">E-posta</FormLabel>
                    <Input {...field} type="email" placeholder="E-posta adresinizi girin" size="sm" />
                    <FormErrorMessage fontSize="xs">{errors.email}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>

              <Field name="password">
                {({ field }: FieldProps) => (
                  <FormControl isInvalid={!!(errors.password && touched.password)}>
                    <FormLabel fontSize="sm">Şifre</FormLabel>
                    <Input {...field} type="password" placeholder="Şifrenizi girin" size="sm" />
                    <FormErrorMessage fontSize="xs">{errors.password}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>

              <Field name="confirmPassword">
                {({ field }: FieldProps) => (
                  <FormControl isInvalid={!!(errors.confirmPassword && touched.confirmPassword)}>
                    <FormLabel fontSize="sm">Şifre Onayı</FormLabel>
                    <Input {...field} type="password" placeholder="Şifrenizi tekrar girin" size="sm" />
                    <FormErrorMessage fontSize="xs">{errors.confirmPassword}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>

              <Button type="submit" colorScheme="blue" size="sm" isLoading={isSubmitting}>
                Kayıt Ol
              </Button>

              <Text textAlign="center" fontSize="sm">
                Zaten hesabınız var mı?{" "}
                <Link color="blue.500" href="/sign-in" fontSize="sm">Giriş Yap</Link>
              </Text>
            </VStack>
          </Form>
        )}
      </Formik>
    </Box>
  );
}