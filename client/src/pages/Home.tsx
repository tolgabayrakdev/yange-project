import { Box, Button, Container, Heading, Text, VStack, useColorModeValue } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const bgColor = useColorModeValue("gray.50", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");

  return (
    <Box bg={bgColor} minH="100vh" py={20}>
      <Container maxW="container.xl">
        <VStack spacing={8} align="center" textAlign="center">
          <Heading as="h1" size="2xl" color={textColor}>
            Hoş Geldiniz
          </Heading>
          <Text fontSize="xl" color={textColor}>
            Bu uygulama, kullanıcıların kişisel bilgilerini yönetmelerine ve güncellemelerine olanak tanır.
          </Text>
          <Text fontSize="lg" color={textColor}>
            Güvenli ve kullanıcı dostu arayüzümüz ile hesabınızı kolayca yönetebilirsiniz.
          </Text>
          <Button 
            colorScheme="blue" 
            size="md" 
            onClick={() => navigate("/sign-in")}
          >
            Giriş Yap
          </Button>
        </VStack>
      </Container>
    </Box>
  );
}
