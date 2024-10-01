import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  VStack,
  Heading,
  useToast,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Tag,
  HStack,
  Text,
  Radio,
  RadioGroup,
  Stack,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  InputGroup,
  InputLeftElement,
  IconButton,
  Spinner,
  Center,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
} from '@chakra-ui/react';
import { SearchIcon, ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { BsThreeDotsVertical } from 'react-icons/bs';

interface Decision {
  id: number;
  title: string;
  description: string;
  alternatives: string;
  category: string;
  date: string;
  outcomes: Outcome[];
}

interface Outcome {
  id: number;
  type: string;
  impact: string;
  notes: string;
}

export default function Desicion() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [alternatives, setAlternatives] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [selectedDecision, setSelectedDecision] = useState<Decision | null>(null);
  const [outcomeType, setOutcomeType] = useState('');
  const [outcomeImpact, setOutcomeImpact] = useState('');
  const [outcomeNotes, setOutcomeNotes] = useState('');
  const toast = useToast();
  const { isOpen: isDecisionModalOpen, onOpen: onDecisionModalOpen, onClose: onDecisionModalClose } = useDisclosure();
  const { isOpen: isOutcomeModalOpen, onOpen: onOutcomeModalOpen, onClose: onOutcomeModalClose } = useDisclosure();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredDecisions, setFilteredDecisions] = useState<Decision[]>([]);
  const decisionsPerPage = 10;
  const [isLoading, setIsLoading] = useState(true);
  const [editingDecision, setEditingDecision] = useState<Decision | null>(null);
  const { isOpen: isEditModalOpen, onOpen: onEditModalOpen, onClose: onEditModalClose } = useDisclosure();
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [decisionToDelete, setDecisionToDelete] = useState<Decision | null>(null);
  const cancelRef = React.useRef<HTMLButtonElement>(null);
  const [expandedDecisions, setExpandedDecisions] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    // API'den kararları çekme simülasyonu
    setIsLoading(true);
    setTimeout(() => {
      const fetchedDecisions = Array.from({ length: 50 }, (_, i) => ({
        id: i + 1,
        title: `Karar ${i + 1}`,
        description: `Açıklama ${i + 1}`,
        alternatives: `Alternatif ${i + 1}`,
        category: ['İş', 'Finans', 'Kişisel', 'Diğer'][Math.floor(Math.random() * 4)],
        date: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString().split('T')[0],
        outcomes: [],
      }));
      setDecisions(fetchedDecisions);
      setIsLoading(false);
    }, 2000); // 2 saniye gecikme simülasyonu
  }, []);

  useEffect(() => {
    const filtered = decisions.filter(decision =>
      decision.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      decision.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      decision.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDecisions(filtered);
    setCurrentPage(1);
  }, [searchTerm, decisions]);

  const indexOfLastDecision = currentPage * decisionsPerPage;
  const indexOfFirstDecision = indexOfLastDecision - decisionsPerPage;
  const currentDecisions = filteredDecisions.slice(indexOfFirstDecision, indexOfLastDecision);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleDecisionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newDecision: Decision = {
      id: Date.now(),
      title,
      description,
      alternatives,
      category,
      date,
      outcomes: [],
    };
    setDecisions([...decisions, newDecision]);
    
    toast({
      title: "Karar eklendi.",
      description: "Yeni kararınız başarıyla kaydedildi.",
      status: "success",
      duration: 5000,
      isClosable: true,
    });

    setTitle('');
    setDescription('');
    setAlternatives('');
    setCategory('');
    setDate('');
    onDecisionModalClose();
  };

  const handleOutcomeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDecision) return;

    const newOutcome: Outcome = {
      id: Date.now(),
      type: outcomeType,
      impact: outcomeImpact,
      notes: outcomeNotes,
    };

    const updatedDecisions = decisions.map(decision => 
      decision.id === selectedDecision.id 
        ? { ...decision, outcomes: [...decision.outcomes, newOutcome] }
        : decision
    );

    setDecisions(updatedDecisions);
    setSelectedDecision({ ...selectedDecision, outcomes: [...selectedDecision.outcomes, newOutcome] });
    
    toast({
      title: "Sonuç eklendi.",
      description: "Yeni sonuç başarıyla kaydedildi.",
      status: "success",
      duration: 5000,
      isClosable: true,
    });

    setOutcomeType('');
    setOutcomeImpact('');
    setOutcomeNotes('');
    onOutcomeModalClose();
  };

  const getCategoryColor = (category: string) => {
    switch(category.toLowerCase()) {
      case 'iş':
        return 'blue';
      case 'finans':
        return 'green';
      case 'kişisel':
        return 'purple';
      default:
        return 'gray';
    }
  };

  const handleEditDecision = (decision: Decision) => {
    setEditingDecision(decision);
    setTitle(decision.title);
    setDescription(decision.description);
    setAlternatives(decision.alternatives);
    setCategory(decision.category);
    setDate(decision.date);
    onEditModalOpen();
  };

  const handleUpdateDecision = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDecision) return;

    const updatedDecision: Decision = {
      ...editingDecision,
      title,
      description,
      alternatives,
      category,
      date,
    };

    const updatedDecisions = decisions.map(d => 
      d.id === updatedDecision.id ? updatedDecision : d
    );

    setDecisions(updatedDecisions);
    
    toast({
      title: "Karar güncellendi.",
      description: "Kararınız başarıyla güncellendi.",
      status: "success",
      duration: 5000,
      isClosable: true,
    });

    onEditModalClose();
  };

  const handleDeleteDecision = (decision: Decision) => {
    setDecisionToDelete(decision);
    setIsDeleteAlertOpen(true);
  };

  const confirmDeleteDecision = () => {
    if (!decisionToDelete) return;

    const updatedDecisions = decisions.filter(d => d.id !== decisionToDelete.id);
    setDecisions(updatedDecisions);

    toast({
      title: "Karar silindi.",
      description: "Kararınız başarıyla silindi.",
      status: "success",
      duration: 5000,
      isClosable: true,
    });

    setIsDeleteAlertOpen(false);
    setDecisionToDelete(null);
  };

  const getOutcomeColor = (type: string) => {
    return type === 'positive' ? 'green' : 'red';
  };

  const toggleExpand = (decisionId: number) => {
    setExpandedDecisions(prev => ({
      ...prev,
      [decisionId]: !prev[decisionId]
    }));
  };

  const renderOutcomes = (decision: Decision) => {
    const isExpanded = expandedDecisions[decision.id] || false;
    const displayedOutcomes = isExpanded ? decision.outcomes : decision.outcomes.slice(0, 5);

    return (
      <>
        <Table variant="simple" size="sm">
          <Thead>
            <Tr>
              <Th>Tür</Th>
              <Th>Etki</Th>
              <Th>Notlar</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {displayedOutcomes.map((outcome) => (
              <Tr key={outcome.id}>
                <Td>
                  <Tag colorScheme={getOutcomeColor(outcome.type)}>
                    {outcome.type === 'positive' ? 'Pozitif' : 'Negatif'}
                  </Tag>
                </Td>
                <Td>{outcome.impact}</Td>
                <Td>{outcome.notes}</Td>
                <Td>
                  <Popover>
                    <PopoverTrigger>
                      <IconButton
                        aria-label="Sonuç detayları"
                        icon={<BsThreeDotsVertical />}
                        size="sm"
                        variant="ghost"
                      />
                    </PopoverTrigger>
                    <PopoverContent>
                      <PopoverArrow />
                      <PopoverCloseButton />
                      <PopoverHeader>Sonuç Detayları</PopoverHeader>
                      <PopoverBody>
                        <VStack align="start" spacing={2}>
                          <Text><strong>Tür:</strong> {outcome.type === 'positive' ? 'Pozitif' : 'Negatif'}</Text>
                          <Text><strong>Etki:</strong> {outcome.impact}</Text>
                          <Text><strong>Notlar:</strong> {outcome.notes}</Text>
                        </VStack>
                      </PopoverBody>
                    </PopoverContent>
                  </Popover>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
        {decision.outcomes.length > 5 && (
          <Button 
            size="sm" 
            onClick={() => toggleExpand(decision.id)} 
            mt={2}
          >
            {isExpanded ? 'Daha az göster' : 'Daha fazla yükle'}
          </Button>
        )}
      </>
    );
  };

  return (
    <Box maxWidth="100%">
      <HStack justify="space-between" mb={6}>
        <Heading size="lg">Kararlar</Heading>
        <Button onClick={onDecisionModalOpen} colorScheme="blue" size="sm">
          Yeni Karar Ekle
        </Button>
      </HStack>

      <InputGroup mb={4}>
        <InputLeftElement pointerEvents="none">
          <SearchIcon color="gray.300" />
        </InputLeftElement>
        <Input
          type="text"
          placeholder="Kararları ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </InputGroup>

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
          <Accordion allowMultiple>
            {currentDecisions.map((decision) => (
              <AccordionItem key={decision.id}>
                <h2>
                  <AccordionButton>
                    <Box flex="1" textAlign="left">
                      <Text fontWeight="bold">{decision.title}</Text>
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  <VStack align="stretch" spacing={3}>
                    <Box>
                      <Text fontWeight="bold">Açıklama:</Text>
                      <Text>{decision.description}</Text>
                    </Box>
                    <Box>
                      <Text fontWeight="bold">Alternatifler:</Text>
                      <Text>{decision.alternatives}</Text>
                    </Box>
                    <HStack>
                      <Text fontWeight="bold">Kategori:</Text>
                      <Tag size="sm" variant="solid" colorScheme={getCategoryColor(decision.category)}>
                        {decision.category}
                      </Tag>
                    </HStack>
                    <Box>
                      <Text fontWeight="bold">Tarih:</Text>
                      <Text>{decision.date}</Text>
                    </Box>
                    <Box>
                      <Heading size="sm" mb={2}>Sonuçlar</Heading>
                      {decision.outcomes.length > 0 ? (
                        renderOutcomes(decision)
                      ) : (
                        <Text>Henüz sonuç eklenmemiş.</Text>
                      )}
                    </Box>
                    <HStack spacing={2} mt={2}>
                      <Button 
                        size="sm" 
                        colorScheme="teal" 
                        onClick={() => {
                          setSelectedDecision(decision);
                          onOutcomeModalOpen();
                        }}
                      >
                        Sonuç Ekle
                      </Button>
                      <Button
                        size="sm"
                        colorScheme="blue"
                        onClick={() => handleEditDecision(decision)}
                      >
                        Düzenle
                      </Button>
                      <Button
                        size="sm"
                        colorScheme="red"
                        onClick={() => handleDeleteDecision(decision)}
                      >
                        Sil
                      </Button>
                    </HStack>
                  </VStack>
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>

          <HStack justify="center" mt={6}>
            <IconButton
              icon={<ChevronLeftIcon />}
              onClick={() => paginate(currentPage - 1)}
              isDisabled={currentPage === 1}
              aria-label="Previous page"
            />
            <Text>{currentPage} / {Math.ceil(filteredDecisions.length / decisionsPerPage)}</Text>
            <IconButton
              icon={<ChevronRightIcon />}
              onClick={() => paginate(currentPage + 1)}
              isDisabled={currentPage === Math.ceil(filteredDecisions.length / decisionsPerPage)}
              aria-label="Next page"
            />
          </HStack>
        </>
      )}

      {/* Karar Ekleme Modalı */}
      <Modal isOpen={isDecisionModalOpen} onClose={onDecisionModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Yeni Karar Ekle</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleDecisionSubmit}>
              <VStack spacing={3} align="stretch">
                <FormControl isRequired>
                  <FormLabel>Karar Başlığı</FormLabel>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Kararın kısa tanımı"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Açıklama</FormLabel>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Kararın ayrıntılı açıklaması"
                    rows={3}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Alternatifler</FormLabel>
                  <Textarea
                    value={alternatives}
                    onChange={(e) => setAlternatives(e.target.value)}
                    placeholder="Karar vermeden önceki seçenekler"
                    rows={2}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Kategori</FormLabel>
                  <Select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Kategori seçin"
                  >
                    <option value="İş">İş</option>
                    <option value="Finans">Finans</option>
                    <option value="Kişisel">Kişisel</option>
                    <option value="Diğer">Diğer</option>
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Tarih</FormLabel>
                  <Input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </FormControl>
              </VStack>
            </form>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleDecisionSubmit}>
              Kararı Kaydet
            </Button>
            <Button variant="ghost" onClick={onDecisionModalClose}>İptal</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Sonuç Ekleme Modalı */}
      <Modal isOpen={isOutcomeModalOpen} onClose={onOutcomeModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Sonuç Ekle: {selectedDecision?.title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleOutcomeSubmit}>
              <VStack spacing={3} align="stretch">
                <FormControl isRequired>
                  <FormLabel>Sonucun Türü</FormLabel>
                  <RadioGroup onChange={setOutcomeType} value={outcomeType}>
                    <Stack direction="row">
                      <Radio value="positive">Pozitif</Radio>
                      <Radio value="negative">Negatif</Radio>
                    </Stack>
                  </RadioGroup>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Etki</FormLabel>
                  <Select
                    value={outcomeImpact}
                    onChange={(e) => setOutcomeImpact(e.target.value)}
                    placeholder="Etkiyi seçin"
                  >
                    <option value="financial_gain">Para Kazancı</option>
                    <option value="time_saving">Zaman Tasarrufu</option>
                    <option value="stress_reduction">Stres Azalması</option>
                    <option value="other">Diğer</option>
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Notlar</FormLabel>
                  <Textarea
                    value={outcomeNotes}
                    onChange={(e) => setOutcomeNotes(e.target.value)}
                    placeholder="Kararın sonucu hakkında notlarınız"
                    rows={3}
                  />
                </FormControl>
              </VStack>
            </form>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleOutcomeSubmit}>
              Sonucu Kaydet
            </Button>
            <Button variant="ghost" onClick={onOutcomeModalClose}>İptal</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Karar Düzenleme Modalı */}
      <Modal isOpen={isEditModalOpen} onClose={onEditModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Kararı Düzenle</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleUpdateDecision}>
              <VStack spacing={3} align="stretch">
                <FormControl isRequired>
                  <FormLabel>Karar Başlığı</FormLabel>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Kararın kısa tanımı"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Açıklama</FormLabel>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Kararın ayrıntılı açıklaması"
                    rows={3}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Alternatifler</FormLabel>
                  <Textarea
                    value={alternatives}
                    onChange={(e) => setAlternatives(e.target.value)}
                    placeholder="Karar vermeden önceki seçenekler"
                    rows={2}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Kategori</FormLabel>
                  <Select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Kategori seçin"
                  >
                    <option value="İş">İş</option>
                    <option value="Finans">Finans</option>
                    <option value="Kişisel">Kişisel</option>
                    <option value="Diğer">Diğer</option>
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Tarih</FormLabel>
                  <Input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </FormControl>
              </VStack>
            </form>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleUpdateDecision}>
              Güncelle
            </Button>
            <Button variant="ghost" onClick={onEditModalClose}>İptal</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Silme Onay Dialog'u */}
      <AlertDialog
        isOpen={isDeleteAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsDeleteAlertOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Kararı Sil
            </AlertDialogHeader>

            <AlertDialogBody>
              Bu kararı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsDeleteAlertOpen(false)}>
                İptal
              </Button>
              <Button colorScheme="red" onClick={confirmDeleteDecision} ml={3}>
                Sil
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
}