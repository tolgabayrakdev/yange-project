import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Select,
  Textarea,
  Badge,
  useToast,
  Input,
  List,
  ListItem,
  Text,
  Icon,
  VStack,
  HStack,
  CloseButton,
  Link,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from '@chakra-ui/react';
import { AttachmentIcon, DownloadIcon } from '@chakra-ui/icons';

interface Process {
  id: number;
  client_id: number;
  client: {
    name: string;
    surname: string;
    email: string;
  };
  description: string;
  status: 'Başlatıldı' | 'Devam Ediyor' | 'Tamamlandı';
  file_attachment: string | null;
  created_at: string;
}

interface Client {
  id: number;
  name: string;
  surname: string;
}

export default function Process() {
  const [processes, setProcesses] = useState<Process[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedProcess, setSelectedProcess] = useState<Process | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [processToDelete, setProcessToDelete] = useState<number | null>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);

  const statusMapping = {
    'Başlatıldı': 'started',
    'Devam Ediyor': 'in_progress',
    'Tamamlandı': 'completed'
  };

  useEffect(() => {
    fetchProcesses();
    fetchClients();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = clients.filter(client => 
        `${client.name} ${client.surname}`.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredClients(filtered);
    } else {
      setFilteredClients([]);
    }
  }, [searchTerm, clients]);

  const fetchProcesses = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/processes', {
        method: 'GET',
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setProcesses(data);
    } catch (error) {
      console.error('Error fetching processes:', error);
      toast({
        title: 'İşlem verileri alınamadı.',
        description: 'Lütfen daha sonra tekrar deneyin.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const fetchClients = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/clients', {
        method: 'GET',
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setClients(data);
    } catch (error) {
      console.error('Error fetching clients:', error);
      toast({
        title: 'Müşteri verisi alınamadı.',
        description: 'Lütfen daha sonra tekrar deneyin.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleAddProcess = () => {
    setSelectedProcess(null);
    onOpen();
  };

  const handleEditProcess = (process: Process) => {
    setSelectedProcess(process);
    onOpen();
  };

  const handleDeleteProcess = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8000/api/processes/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      setProcesses(processes.filter(p => p.id !== id));
      toast({
        title: 'İşlem silindi.',
        description: 'İşlem başarıyla silindi.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error deleting process:', error);
      toast({
        title: 'İşlem silinemedi.',
        description: 'Lütfen daha sonra tekrar deneyin.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsDeleteAlertOpen(false);
      setProcessToDelete(null);
    }
  };

  const confirmDelete = (id: number) => {
    setProcessToDelete(id);
    setIsDeleteAlertOpen(true);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      const validFiles = newFiles.filter(file => {
        const fileExtension = file.name.split('.').pop()?.toLowerCase();
        return fileExtension === 'pdf' || fileExtension === 'xlsx' || fileExtension === 'xls';
      });

      if (validFiles.length + selectedFiles.length > 3) {
        toast({
          title: "Dosya limiti aşıldı",
          description: "En fazla 3 dosya ekleyebilirsiniz.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      if (validFiles.length !== newFiles.length) {
        toast({
          title: "Bazı dosyalar eklenmedi",
          description: "Sadece PDF ve Excel dosyaları kabul edilmektedir.",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
      }

      setSelectedFiles(prevFiles => [...prevFiles, ...validFiles]);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    // Seçili müşteri ID'sini ekle
    if (selectedClient) {
      formData.append('client_id', selectedClient.id.toString());
    }

    // Status değerini İngilizce'ye çevir
    const turkishStatus = formData.get('status') as string;
    formData.set('status', statusMapping[turkishStatus as keyof typeof statusMapping]);

    // Dosyaları ekle
    selectedFiles.forEach((file) => {
      formData.append(`file`, file);
    });

    try {
      const response = await fetch('http://localhost:8000/api/processes', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('API error');
      }

      const result = await response.json();

      onClose();
      fetchProcesses(); // Listeyi yenile
      toast({
        title: 'Yeni işlem eklendi.',
        description: result.message,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error submitting process:', error);
      toast({
        title: 'İşlem kaydedilemedi.',
        description: 'Lütfen daha sonra tekrar deneyin.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const getStatusColor = (status: Process['status']) => {
    switch (status) {
      case 'Başlatıldı':
        return 'yellow';
      case 'Devam Ediyor':
        return 'blue';
      case 'Tamamlandı':
        return 'green';
      default:
        return 'gray';
    }
  };

  const handleClientSelect = (client: Client) => {
    setSelectedClient(client);
    setSearchTerm('');
    setFilteredClients([]);
  };

  const handleResetClientSelection = () => {
    setSelectedClient(null);
    setSearchTerm('');
  };

  return (
    <Box>
      <Heading as="h1" size="md" mb={4}>
        İşlemler
      </Heading>
      <Button onClick={handleAddProcess} colorScheme="blue" size="sm" mb={3}>
        Yeni İşlem Ekle
      </Button>
      <Table mt={3} variant="simple" size="sm">
        <Thead>
          <Tr>
            <Th>Müşteri</Th>
            <Th>Açıklama</Th>
            <Th>Durum</Th>
            <Th>Dosya</Th>
            <Th>İşlemler</Th>
          </Tr>
        </Thead>
        <Tbody>
          {processes.map((process) => (
            <Tr key={process.id}>
              <Td>{process.client.name} {process.client.surname}</Td>
              <Td>{process.description}</Td>
              <Td>
                <Badge colorScheme={getStatusColor(process.status)}>
                  {process.status}
                </Badge>
              </Td>
              <Td>
                {process.file_attachment ? (
                  <Link href={`http://localhost:8000/uploads/client_documents/${process.client_id}/${process.file_attachment}`} isExternal>
                    <Button leftIcon={<DownloadIcon />} size="xs">
                      İndir
                    </Button>
                  </Link>
                ) : (
                  'Dosya yok'
                )}
              </Td>
              <Td>
                <Button onClick={() => handleEditProcess(process)} size="xs" mr={2}>
                  Düzenle
                </Button>
                <Button onClick={() => confirmDelete(process.id)} colorScheme="red" size="xs">
                  Sil
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Modal isOpen={isOpen} onClose={onClose} size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="lg">{selectedProcess ? 'İşlem Düzenle' : 'Yeni İşlem Ekle'}</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleSubmit}>
            <ModalBody>
              <FormControl size="sm">
                <FormLabel>Müşteri</FormLabel>
                {selectedClient ? (
                  <Box display="flex" alignItems="center">
                    <Text>{selectedClient.name} {selectedClient.surname}</Text>
                    <Button size="xs" ml={2} onClick={handleResetClientSelection}>Değiştir</Button>
                  </Box>
                ) : (
                  <>
                    <Input
                      placeholder="Müşteri adı veya soyadı"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      mb={2}
                    />
                    {filteredClients.length > 0 && (
                      <List spacing={2} mb={4} maxH="200px" overflowY="auto">
                        {filteredClients.map((client) => (
                          <ListItem 
                            key={client.id} 
                            p={2} 
                            bg="gray.100" 
                            borderRadius="md"
                            cursor="pointer"
                            onClick={() => handleClientSelect(client)}
                          >
                            {client.name} {client.surname}
                          </ListItem>
                        ))}
                      </List>
                    )}
                  </>
                )}
              </FormControl>
              <FormControl mt={3} size="sm">
                <FormLabel>Açıklama</FormLabel>
                <Textarea
                  name="description"
                  defaultValue={selectedProcess?.description}
                  size="sm"
                />
              </FormControl>
              <FormControl mt={3} size="sm">
                <FormLabel>Durum</FormLabel>
                <Select name="status" defaultValue={selectedProcess?.status || 'Başlatıldı'} size="sm">
                  <option value="Başlatıldı">Başlatıldı</option>
                  <option value="Devam Ediyor">Devam Ediyor</option>
                  <option value="Tamamlandı">Tamamlandı</option>
                </Select>
              </FormControl>
              <FormControl mt={3} size="sm">
                <FormLabel>Dosya Ekle (En fazla 3 adet PDF veya Excel)</FormLabel>
                <Input
                  type="file"
                  onChange={handleFileChange}
                  hidden
                  ref={fileInputRef}
                  accept=".pdf,.xlsx,.xls"
                  multiple
                />
                <Button
                  leftIcon={<Icon as={AttachmentIcon} />}
                  onClick={() => fileInputRef.current?.click()}
                  size="sm"
                  isDisabled={selectedFiles.length >= 3}
                >
                  Dosya Seç
                </Button>
                <VStack mt={2} align="stretch">
                  {selectedFiles.map((file, index) => (
                    <HStack key={index} justify="space-between" bg="gray.100" p={2} borderRadius="md">
                      <Text fontSize="sm">{file.name}</Text>
                      <CloseButton size="sm" onClick={() => handleRemoveFile(index)} />
                    </HStack>
                  ))}
                </VStack>
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button type="submit" colorScheme="blue" size="sm" mr={3}>
                Kaydet
              </Button>
              <Button onClick={onClose} size="sm">İptal</Button>
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
              İşlemi Sil
            </AlertDialogHeader>

            <AlertDialogBody>
              Bu işlemi silmek istediğinizden emin misiniz? Bu eylem geri alınamaz.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsDeleteAlertOpen(false)}>
                İptal
              </Button>
              <Button colorScheme="red" onClick={() => processToDelete && handleDeleteProcess(processToDelete)} ml={3}>
                Sil
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
}