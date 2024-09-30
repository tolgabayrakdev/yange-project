import { Box, Button, FormControl, FormLabel, Input, VStack, Heading, Text, Link, FormErrorMessage, useToast } from "@chakra-ui/react";
import { Formik, Form, Field, FieldProps } from "formik";
import * as Yup from "yup";

const SignInSchema = Yup.object().shape({
  email: Yup.string().email("Geçersiz e-posta adresi").required("E-posta adresi gereklidir"),
  password: Yup.string().min(6, "Şifre en az 6 karakter olmalıdır").required("Şifre gereklidir"),
});

export default function SignIn() {
  const toast = useToast();

  return (
    <Box maxWidth="350px" margin="auto" mt={6}>
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={SignInSchema}
        onSubmit={async (values, actions) => {
          try {
            const response = await fetch('http://localhost:8000/api/auth/login', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(values),
            });

            if (response.ok) {
              toast({
                title: "Giriş başarılı",
                description: "Hoş geldiniz!",
                status: "success",
                duration: 3000,
                isClosable: true,
              });
              // Burada kullanıcıyı ana sayfaya yönlendirebilirsiniz
              // Örneğin: window.location.href = '/dashboard';
            } else {
              throw new Error('Giriş başarısız');
            }
          } catch (error) {
            toast({
              title: "Giriş başarısız",
              description: "E-posta adresinizi veya parolanızı kontrol ediniz.",
              status: "warning",
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
              <Heading as="h1" size="lg" textAlign="center">Giriş Yap</Heading>
              
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

              <Button type="submit" colorScheme="blue" size="sm" isLoading={isSubmitting}>
                Giriş Yap
              </Button>

              <Text textAlign="center" fontSize="sm">
                <Link color="blue.500" href="/reset-password" fontSize="sm">Şifremi Unuttum</Link>
              </Text>

              <Text textAlign="center" fontSize="sm">
                Hesabınız yok mu?{" "}
                <Link color="blue.500" href="/sign-up" fontSize="sm">Hesap Oluştur</Link>
              </Text>
            </VStack>
          </Form>
        )}
      </Formik>
    </Box>
  );
}
