import { Box, Button, FormControl, FormLabel, Input, VStack, Heading, Text, Link, FormErrorMessage } from "@chakra-ui/react";
import { Formik, Form, Field, FieldProps } from "formik";
import * as Yup from "yup";

const SignInSchema = Yup.object().shape({
  email: Yup.string().email("Geçersiz e-posta adresi").required("E-posta adresi gereklidir"),
  password: Yup.string().min(6, "Şifre en az 6 karakter olmalıdır").required("Şifre gereklidir"),
});

export default function SignIn() {
  return (
    <Box maxWidth="350px" margin="auto" mt={6}>
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={SignInSchema}
        onSubmit={(values, actions) => {
          console.log(values);
          // Burada giriş işlemini gerçekleştirebilirsiniz
          actions.setSubmitting(false);
        }}
      >
        {({ errors, touched }) => (
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

              <Button type="submit" colorScheme="blue" size="sm">
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
