import React, { useState } from "react";
import {
  Box,
  VStack,
  Heading,
  Text,
  FormControl,
  FormLabel,
  Input,
  Button,
  Divider,
  useColorModeValue,
  Alert,
  AlertIcon,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";

export default function Profile() {
  const bgColor = useColorModeValue("gray.50", "gray.700");
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("john.doe@example.com");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement>(null);

  const handleSave = () => {
    // Burada API çağrısı yapılabilir
    setIsEditing(false);
  };

  const handleDeleteAccount = () => {
    // Burada hesap silme işlemi gerçekleştirilebilir
    onClose();
  };

  return (
    <Box maxW="600px" ml={8}>
      <VStack spacing={6} align="stretch">
        <Box bg={bgColor} p={4} borderRadius="md" boxShadow="sm">
          <Heading size="md" mb={3}>Kullanıcı Bilgileri</Heading>
          <VStack spacing={3} align="stretch">
            <FormControl>
              <FormLabel fontSize="sm">Ad Soyad</FormLabel>
              <Input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                isReadOnly={!isEditing}
                size="sm" 
              />
            </FormControl>
            <FormControl>
              <FormLabel fontSize="sm">E-posta</FormLabel>
              <Input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                isReadOnly={!isEditing}
                size="sm" 
              />
            </FormControl>
            {isEditing ? (
              <Button colorScheme="blue" size="sm" onClick={handleSave} width="100px">Kaydet</Button>
            ) : (
              <Button colorScheme="blue" size="sm" onClick={() => setIsEditing(true)} width="100px">Düzenle</Button>
            )}
          </VStack>
        </Box>

        <Box bg={bgColor} p={4} borderRadius="md" boxShadow="sm">
          <Heading size="md" mb={3}>Şifre Değiştir</Heading>
          <VStack spacing={3} align="stretch">
            <FormControl>
              <FormLabel fontSize="sm">Mevcut Şifre</FormLabel>
              <Input type="password" size="sm" />
            </FormControl>
            <FormControl>
              <FormLabel fontSize="sm">Yeni Şifre</FormLabel>
              <Input type="password" size="sm" />
            </FormControl>
            <FormControl>
              <FormLabel fontSize="sm">Yeni Şifre (Tekrar)</FormLabel>
              <Input type="password" size="sm" />
            </FormControl>
            <Button colorScheme="blue" size="sm" width="150px">Şifreyi Güncelle</Button>
          </VStack>
        </Box>

        <Box bg={bgColor} p={4} borderRadius="md" boxShadow="sm">
          <Heading size="md" mb={3} color="red.500">Danger Zone</Heading>
          <Divider mb={3} />
          <Text mb={3} fontSize="sm">
            Hesabınızı silmek geri alınamaz bir işlemdir. Tüm verileriniz kalıcı olarak silinecektir.
          </Text>
          <Alert status="error" mb={3} fontSize="sm">
            <AlertIcon />
            Bu işlem geri alınamaz!
          </Alert>
          <Button colorScheme="red" size="sm" width="150px" onClick={onOpen}>Hesabı Sil</Button>
        </Box>
      </VStack>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Hesabı Sil
            </AlertDialogHeader>

            <AlertDialogBody>
              Bu işlemi gerçekten yapmak istiyor musunuz? Bu işlem geri alınamaz.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                İptal
              </Button>
              <Button colorScheme="red" onClick={handleDeleteAccount} ml={3}>
                Hesabı Sil
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
}
