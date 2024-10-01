import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Textarea,
  Select,
  VStack,
  Heading,
  useToast,
  Radio,
  RadioGroup,
  Stack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '@chakra-ui/react';

interface Outcome {
  id: number;
  type: string;
  impact: string;
  notes: string;
}

interface Decision {
  id: number;
  title: string;
}

export default function Outcome() {
  const [type, setType] = useState('');
  const [impact, setImpact] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedDecision, setSelectedDecision] = useState('');
  const [outcomes, setOutcomes] = useState<Outcome[]>([]);
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const toast = useToast();

  useEffect(() => {
    // Burada normalde API'den kararları çekeceksiniz
    setDecisions([
      { id: 1, title: 'Karar 1' },
      { id: 2, title: 'Karar 2' },
      { id: 3, title: 'Karar 3' },
    ]);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDecision) {
      toast({
        title: "Hata",
        description: "Lütfen bir karar seçin.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    
    const newOutcome: Outcome = {
      id: Date.now(), // Geçici ID, normalde backend tarafından sağlanır
      type,
      impact,
      notes,
    };
    
    setOutcomes([...outcomes, newOutcome]);
    
    toast({
      title: "Sonuç eklendi.",
      description: "Yeni sonuç başarıyla kaydedildi.",
      status: "success",
      duration: 5000,
      isClosable: true,
    });

    // Form alanlarını sıfırla
    setType('');
    setImpact('');
    setNotes('');
  };

  return (
    <Box maxWidth="800px">
      <Heading size="lg" mb={4}>Sonuç Ekle</Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={3} align="stretch">
          <FormControl isRequired size="sm">
            <FormLabel fontSize="sm">Karar</FormLabel>
            <Select
              size="sm"
              value={selectedDecision}
              onChange={(e) => setSelectedDecision(e.target.value)}
              placeholder="Karar seçin"
            >
              {decisions.map((decision) => (
                <option key={decision.id} value={decision.id}>{decision.title}</option>
              ))}
            </Select>
          </FormControl>

          <FormControl isRequired size="sm">
            <FormLabel fontSize="sm">Sonucun Türü</FormLabel>
            <RadioGroup onChange={setType} value={type}>
              <Stack direction="row">
                <Radio value="positive">Pozitif</Radio>
                <Radio value="negative">Negatif</Radio>
              </Stack>
            </RadioGroup>
          </FormControl>

          <FormControl isRequired size="sm">
            <FormLabel fontSize="sm">Etki</FormLabel>
            <Select
              size="sm"
              value={impact}
              onChange={(e) => setImpact(e.target.value)}
              placeholder="Etkiyi seçin"
            >
              <option value="financial_gain">Para Kazancı</option>
              <option value="time_saving">Zaman Tasarrufu</option>
              <option value="stress_reduction">Stres Azalması</option>
              <option value="other">Diğer</option>
            </Select>
          </FormControl>

          <FormControl isRequired size="sm">
            <FormLabel fontSize="sm">Notlar</FormLabel>
            <Textarea
              size="sm"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Kararın sonucu hakkında notlarınız"
              rows={3}
            />
          </FormControl>

          <Button type="submit" colorScheme="blue" size="sm" mt={2}>
            Sonucu Kaydet
          </Button>
        </VStack>
      </form>

      {outcomes.length > 0 && (
        <Box mt={8}>
          <Heading size="md" mb={4}>Eklenen Sonuçlar</Heading>
          <Table variant="simple" size="sm">
            <Thead>
              <Tr>
                <Th>Tür</Th>
                <Th>Etki</Th>
                <Th>Notlar</Th>
              </Tr>
            </Thead>
            <Tbody>
              {outcomes.map((outcome) => (
                <Tr key={outcome.id}>
                  <Td>{outcome.type === 'positive' ? 'Pozitif' : 'Negatif'}</Td>
                  <Td>{outcome.impact}</Td>
                  <Td>{outcome.notes}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      )}
    </Box>
  );
}
