import { Box, Heading, Text, Button, VStack, useColorModeValue } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');

  return (
    <Box 
      bg={bgColor} 
      minH="100vh" 
      display="flex" 
      alignItems="center" 
      justifyContent="center"
    >
      <VStack spacing={6} textAlign="center">
        <Heading as="h1" size="3xl" color={textColor}>
          404
        </Heading>
        <Heading as="h2" size="lg" color={textColor}>
          Sayfa Bulunamadı
        </Heading>
        <Text fontSize="md" color={textColor}>
          Üzgünüz, aradığınız sayfayı bulamadık.
        </Text>
        <Button 
          colorScheme="blue" 
          size="sm" 
          onClick={() => navigate(-1)}
        >
          Önceki Sayfaya Dön
        </Button>
      </VStack>
    </Box>
  );
}