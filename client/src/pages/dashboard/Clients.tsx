import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  useDisclosure,
  VStack,
  HStack,
  Text,
  Flex,
  ButtonGroup,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useToast,
  Spinner,
  Center,
} from "@chakra-ui/react";
import {
  EditIcon,
  DeleteIcon,
  AddIcon,
  SearchIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ViewIcon,
  DownloadIcon,
} from "@chakra-ui/icons";
import jsPDF from "jspdf";
import "jspdf-autotable";

interface Client {
  id: number;
  name: string;
  surname: string;
  email: string;
  phone: string;
  description: string;
}

// Telefon numarasını formatlayan yardımcı fonksiyon
const formatPhoneNumber = (phoneNumber: string): string => {
  // Sadece rakamları al
  return phoneNumber.replace(/\D/g, "");
};

// Telefon numarasını görüntüleme için formatlayan fonksiyon
const formatPhoneNumberForDisplay = (phoneNumber: string): string => {
  const digits = phoneNumber.replace(/\D/g, "");

  // 10 haneli ise format uygula
  if (digits.length === 10) {
    return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
  }
  return phoneNumber;
};

export default function Clients() {
  const [clients, setClients] = useState<Client[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<number | null>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [previewClient, setPreviewClient] = useState<Client | null>(null);
  const {
    isOpen: isPreviewOpen,
    onOpen: onPreviewOpen,
    onClose: onPreviewClose,
  } = useDisclosure();

  useEffect(() => {
    const fetchClients = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("http://localhost:8000/api/clients", {
          method: "GET",
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setClients(data);
      } catch (error) {
        console.error("Error fetching clients:", error);
        toast({
          title: "Müşteri verileri yüklenemedi",
          description: "Lütfen daha sonra tekrar deneyin.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchClients();
  }, []);

  const handleAdd = () => {
    setEditingClient(null);
    onOpen();
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    onOpen();
  };

  const handleDeleteClick = (id: number) => {
    setClientToDelete(id);
    setIsDeleteAlertOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (clientToDelete !== null) {
      try {
        const response = await fetch(
          `http://localhost:8000/api/clients/${clientToDelete}`,
          {
            method: "DELETE",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        if (response.ok) {
          setClients(clients.filter((client) => client.id !== clientToDelete));
          setIsDeleteAlertOpen(false);
          setClientToDelete(null);
          toast({
            title: "Müşteri başarıyla silindi",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
        } else {
          throw new Error("Silme işlemi başarısız oldu");
        }
      } catch (error) {
        console.error("Bir hata oluştu:", error);
        toast({
          title: "Silme işlemi başarısız oldu",
          description: "Lütfen daha sonra tekrar deneyin.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  const fetchClients = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:8000/api/clients", {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setClients(data);
    } catch (error) {
      console.error("Error fetching clients:", error);
      toast({
        title: "Müşteri verileri yüklenemedi",
        description: "Lütfen daha sonra tekrar deneyin.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const values = Object.fromEntries(formData.entries()) as {
      [key: string]: string;
    };

    if (values.name.length < 3) {
      toast({
        title: "Geçersiz ad",
        description: "Ad en az 3 karakter olmalıdır.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (values.surname.length < 3) {
      toast({
        title: "Geçersiz soyad",
        description: "Soyad en az 3 karakter olmalıdır.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // E-posta validasyonu için regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(values.email)) {
      toast({
        title: "Geçersiz e-posta adresi",
        description: "Lütfen geçerli bir e-posta adresi girin.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Telefon numarasını formatla
    values.phone = formatPhoneNumber(values.phone);

    // Telefon numarası doğrulama
    if (values.phone.length !== 10) {
      toast({
        title: "Geçersiz telefon numarası",
        description: "Lütfen 10 haneli bir telefon numarası girin.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      let response;
      if (editingClient) {
        // Düzenleme işlemi
        response = await fetch(
          `http://localhost:8000/api/clients/${editingClient.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
            credentials: "include",
          },
        );

        if (!response.ok) {
          throw new Error("Müşteri güncellenirken bir hata oluştu");
        }

        toast({
          title: "Müşteri başarıyla güncellendi",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        // Ekleme işlemi
        response = await fetch("http://localhost:8000/api/clients", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Müşteri eklenirken bir hata oluştu");
        }

        toast({
          title: "Müşteri başarıyla eklendi",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }

      // Müşteri listesini yeniden çağır
      await fetchClients();

      onClose();
    } catch (error) {
      console.error("Bir hata oluştu:", error);
      toast({
        title: editingClient ? "Müşteri güncellenemedi" : "Müşteri eklenemedi",
        description: "Lütfen daha sonra tekrar deneyin.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
    setCurrentPage(1); // Arama yapıldığında ilk sayfaya dön
  };

  const filteredClients = clients.filter((client) =>
    Object.values(client).some((val) =>
      val.toString().toLowerCase().includes(searchText.toLowerCase()),
    ),
  );

  const paginatedClients = filteredClients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handlePreview = (client: Client) => {
    setPreviewClient(client);
    onPreviewOpen();
  };

  const handleExportPDF = () => {
    const doc: any = new jsPDF();

    // Başlık ekle
    doc.setFontSize(18);
    doc.text("Müsteri Listesi", 14, 22);

    // Tablo oluştur
    doc.autoTable({
      head: [["Ad", "Soyad", "E-posta", "Telefon", "Aciklama"]],
      body: clients.map((client) => [
        client.name,
        client.surname,
        client.email,
        formatPhoneNumberForDisplay(client.phone),
        client.description,
      ]),
      startY: 30,
    });

    // PDF'i indir
    doc.save("musteri-listesi.pdf");
  };

  return (
    <Box>
      <Text fontSize="xl" fontWeight="bold" mb={3}>
        Müşteriler
      </Text>
      <HStack spacing={3} mb={6}>
        <Input
          placeholder="Müşteri ara"
          onChange={handleSearch}
          size="sm"
          width="250px"
        />
        <IconButton
          aria-label="Search"
          icon={<SearchIcon />}
          onClick={() => {}}
          size="sm"
        />
        <Button
          leftIcon={<AddIcon />}
          colorScheme="blue"
          onClick={handleAdd}
          size="sm"
        >
          Yeni Ekle
        </Button>
        <Button
          leftIcon={<DownloadIcon />}
          colorScheme="green"
          onClick={handleExportPDF}
          size="sm"
        >
          PDF İndir
        </Button>
      </HStack>

      {isLoading ? (
        <Center h="200px">
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="md"
          />
        </Center>
      ) : (
        <>
          <Table variant="simple" size="sm">
            <Thead>
              <Tr>
                <Th>Ad</Th>
                <Th>Soyad</Th>
                <Th>E-posta</Th>
                <Th>Telefon</Th>
                <Th>Açıklama</Th>
                <Th>İşlemler</Th>
              </Tr>
            </Thead>
            <Tbody>
              {paginatedClients.map((client) => (
                <Tr key={client.id}>
                  <Td>{client.name}</Td>
                  <Td>{client.surname}</Td>
                  <Td>{client.email}</Td>
                  <Td>{formatPhoneNumberForDisplay(client.phone)}</Td>
                  <Td>{client.description}</Td>
                  <Td>
                    <HStack spacing={1}>
                      <IconButton
                        aria-label="Preview client"
                        icon={<ViewIcon />}
                        onClick={() => handlePreview(client)}
                        size="xs"
                        colorScheme="teal"
                      />
                      <IconButton
                        aria-label="Edit client"
                        icon={<EditIcon />}
                        onClick={() => handleEdit(client)}
                        size="xs"
                      />
                      <IconButton
                        aria-label="Delete client"
                        icon={<DeleteIcon />}
                        onClick={() => handleDeleteClick(client.id)}
                        colorScheme="red"
                        size="xs"
                      />
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>

          <Flex justifyContent="center" mt={4}>
            <ButtonGroup isAttached variant="outline">
              <IconButton
                size="sm"
                aria-label="Previous page"
                icon={<ChevronLeftIcon />}
                onClick={() => handlePageChange(currentPage - 1)}
                isDisabled={currentPage === 1}
              />
              {[...Array(totalPages)].map((_, index) => (
                <Button
                  size="sm"
                  key={index}
                  onClick={() => handlePageChange(index + 1)}
                  colorScheme={currentPage === index + 1 ? "blue" : undefined}
                >
                  {index + 1}
                </Button>
              ))}
              <IconButton
                size="sm"
                aria-label="Next page"
                icon={<ChevronRightIcon />}
                onClick={() => handlePageChange(currentPage + 1)}
                isDisabled={currentPage === totalPages}
              />
            </ButtonGroup>
          </Flex>
        </>
      )}

      <Modal isOpen={isOpen} onClose={onClose} size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="lg">
            {editingClient ? "Müşteri Düzenle" : "Yeni Müşteri Ekle"}
          </ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleModalSubmit}>
            <ModalBody>
              <VStack spacing={3}>
                <FormControl isRequired>
                  <FormLabel fontSize="sm">Ad</FormLabel>
                  <Input
                    name="name"
                    defaultValue={editingClient?.name}
                    size="sm"
                    minLength={3}
                    title="Ad en az 3 karakter olmalıdır"
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel fontSize="sm">Soyad</FormLabel>
                  <Input
                    name="surname"
                    defaultValue={editingClient?.surname}
                    size="sm"
                    minLength={3}
                    title="Soyad en az 3 karakter olmalıdır"
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel fontSize="sm">E-posta</FormLabel>
                  <Input
                    name="email"
                    type="email"
                    defaultValue={editingClient?.email}
                    size="sm"
                    pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                    title="Lütfen geçerli bir e-posta adresi girin"
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel fontSize="sm">Telefon</FormLabel>
                  <Input
                    name="phone"
                    defaultValue={editingClient?.phone}
                    size="sm"
                    placeholder="5XX XXX XXXX"
                    pattern="\d{10}"
                    title="Lütfen 10 haneli bir telefon numarası girin"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel fontSize="sm">Açıklama</FormLabel>
                  <Input
                    name="description"
                    defaultValue={editingClient?.description}
                    size="sm"
                  />
                </FormControl>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} type="submit" size="sm">
                Kaydet
              </Button>
              <Button onClick={onClose} size="sm">
                İptal
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>

      <AlertDialog
        isOpen={isDeleteAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsDeleteAlertOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Müşteriyi Sil
            </AlertDialogHeader>

            <AlertDialogBody>
              Bu işlemi gerçekten yapmak istiyor musunuz? Bu işlem geri
              alınamaz.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button
                ref={cancelRef}
                onClick={() => setIsDeleteAlertOpen(false)}
              >
                İptal
              </Button>
              <Button colorScheme="red" onClick={handleDeleteConfirm} ml={3}>
                Sil
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <Modal isOpen={isPreviewOpen} onClose={onPreviewClose} size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="lg">Müşteri Detayları</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {previewClient && (
              <VStack align="start" spacing={3}>
                <Text>
                  <strong>Ad:</strong> {previewClient.name}
                </Text>
                <Text>
                  <strong>Soyad:</strong> {previewClient.surname}
                </Text>
                <Text>
                  <strong>E-posta:</strong> {previewClient.email}
                </Text>
                <Text>
                  <strong>Telefon:</strong>{" "}
                  {formatPhoneNumberForDisplay(previewClient.phone)}
                </Text>
                <Text>
                  <strong>Açıklama:</strong> {previewClient.description}
                </Text>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={onPreviewClose} size="sm">
              Kapat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
