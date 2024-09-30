import { Box, Button, FormControl, FormLabel, Input, VStack, Heading, Text, Link, FormErrorMessage } from "@chakra-ui/react";
import { Formik, Form, Field, FieldProps } from "formik";
import * as Yup from "yup";

const SignUpSchema = Yup.object().shape({
  username: Yup.string().required("Kullanıcı adı gereklidir"),
  email: Yup.string().email("Geçersiz e-posta adresi").required("E-posta adresi gereklidir"),
  password: Yup.string().min(6, "Şifre en az 6 karakter olmalıdır").required("Şifre gereklidir"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Şifreler eşleşmiyor')
    .required("Şifre onayı gereklidir"),
});

export default function SignUp() {
  return (
    <Box maxWidth="400px" margin="auto" mt={8}>
      <Formik
        initialValues={{ username: "", email: "", password: "", confirmPassword: "" }}
        validationSchema={SignUpSchema}
        onSubmit={(values, actions) => {
          console.log(values);
          // Burada kayıt işlemini gerçekleştirebilirsiniz
          actions.setSubmitting(false);
        }}
      >
        {({ errors, touched }) => (
          <Form>
            <VStack spacing={4} align="stretch">
              <Heading as="h1" size="xl" textAlign="center">Hesap Oluştur</Heading>
              
              <Field name="username">
                {({ field }: FieldProps) => (
                  <FormControl isInvalid={!!(errors.username && touched.username)}>
                    <FormLabel>Kullanıcı Adı</FormLabel>
                    <Input {...field} type="text" placeholder="Kullanıcı adınızı girin" />
                    <FormErrorMessage>{errors.username}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>

              <Field name="email">
                {({ field }: FieldProps) => (
                  <FormControl isInvalid={!!(errors.email && touched.email)}>
                    <FormLabel>E-posta</FormLabel>
                    <Input {...field} type="email" placeholder="E-posta adresinizi girin" />
                    <FormErrorMessage>{errors.email}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>

              <Field name="password">
                {({ field }: FieldProps) => (
                  <FormControl isInvalid={!!(errors.password && touched.password)}>
                    <FormLabel>Şifre</FormLabel>
                    <Input {...field} type="password" placeholder="Şifrenizi girin" />
                    <FormErrorMessage>{errors.password}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>

              <Field name="confirmPassword">
                {({ field }: FieldProps) => (
                  <FormControl isInvalid={!!(errors.confirmPassword && touched.confirmPassword)}>
                    <FormLabel>Şifre Onayı</FormLabel>
                    <Input {...field} type="password" placeholder="Şifrenizi tekrar girin" />
                    <FormErrorMessage>{errors.confirmPassword}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>

              <Button type="submit" colorScheme="blue" size="md">
                Kayıt Ol
              </Button>

              <Text textAlign="center">
                Zaten hesabınız var mı?{" "}
                <Link color="blue.500" href="/sign-in">Giriş Yap</Link>
              </Text>
            </VStack>
          </Form>
        )}
      </Formik>
    </Box>
  );
}
