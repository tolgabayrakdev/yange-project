import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  useToast,
} from "@chakra-ui/react";

export default function Profile() {
  const bgColor = useColorModeValue("gray.50", "gray.700");
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement>(null);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/auth/verify", {
        method: "POST",
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setName(data.user.username);
        setEmail(data.user.email);
      } else {
        throw new Error("Kullanıcı bilgileri alınamadı");
      }
    } catch (error) {
      console.error("Kullanıcı bilgileri alınırken hata oluştu:", error);
      toast({
        title: "Hata",
        description: "Kullanıcı bilgileri alınamadı.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch(import.meta.env.VITE_BACKEND_URL + '/api/user/profile', {
        method: 'PUT',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: name, email }),
      });

      if (response.ok) {
        toast({
          title: "Başarılı",
          description: "Profil bilgileriniz güncellendi.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        setIsEditing(false);
      } else {
        throw new Error('Profil güncellenemedi');
      }
    } catch (error) {
      console.error("Profil güncellenirken hata oluştu:", error);
      toast({
        title: "Hata",
        description: "Profil güncellenirken bir hata oluştu.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: "Hata",
        description: "Yeni şifreler eşleşmiyor.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const response = await fetch(import.meta.env.VITE_BACKEND_URL + '/api/user/change-password', {
        method: 'PUT',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
      });

      if (response.ok) {
        toast({
          title: "Başarılı",
          description: "Şifreniz başarıyla güncellendi.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Şifre güncellenemedi');
      }
    } catch (error: any) {
      console.error("Şifre güncellenirken hata oluştu:", error);
      toast({
        title: "Hata",
        description: error.message || "Şifre güncellenirken bir hata oluştu.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const response = await fetch(import.meta.env.VITE_BACKEND_URL + '/api/user/delete-account', {
        method: 'DELETE',
        credentials: "include",
      });

      if (response.status === 200) {
        toast({
          title: "Başarılı",
          description: "Hesabınız başarıyla silindi.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        setTimeout(() => {
          navigate('/sign-in');
        }, 3000);
      } else {
        throw new Error('Hesap silinemedi');
      }
    } catch (error) {
      console.error("Hesap silinirken hata oluştu:", error);
      toast({
        title: "Hata",
        description: "Hesap silinirken bir hata oluştu.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      onClose(); // AlertDialog'u kapat
    }
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
              <Input 
                type="password" 
                size="sm" 
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel fontSize="sm">Yeni Şifre</FormLabel>
              <Input 
                type="password" 
                size="sm" 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel fontSize="sm">Yeni Şifre (Tekrar)</FormLabel>
              <Input 
                type="password" 
                size="sm" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </FormControl>
            <Button colorScheme="blue" size="sm" width="150px" onClick={handleChangePassword}>
              Şifreyi Güncelle
            </Button>
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