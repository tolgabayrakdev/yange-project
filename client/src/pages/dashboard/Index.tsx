import { useState, useEffect } from "react";
import {
  Box,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

interface Client {
  id: number;
  name: string;
  surname: string;
  email: string;
  phone: string;
  description: string;
}

export default function Index() {
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    const fetchClients = async () => {
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
      }
    };

    fetchClients();
  }, []);

  const totalClients = clients.length;
  // Sadece son 5 müşteriyi al ve ters çevir
  const recentClients = clients.slice(-5).reverse();

  // Örnek veri için müşteri dağılımı (gerçek veriye göre düzenlenebilir)
  const clientDistributionData = [
    { name: "Yeni", value: 30 },
    { name: "Aktif", value: 50 },
    { name: "Pasif", value: 20 },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

  return (
    <Box>
      <Heading as="h1" size="xl" mb={6}>
        Dashboard
      </Heading>

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={6}>
        <Stat>
          <StatLabel>Toplam Müşteri</StatLabel>
          <StatNumber>{totalClients}</StatNumber>
          <StatHelpText>Tüm zamanlar</StatHelpText>
        </Stat>
        {/* Diğer istatistikler eklenebilir */}
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb={6}>
        <Box>
          <Heading as="h2" size="md" mb={4}>
            Müşteri Dağılımı
          </Heading>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={clientDistributionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {clientDistributionData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Box>
        <Box>
          <Heading as="h2" size="md" mb={4}>
            Son Eklenen 5 Müşteri
          </Heading>
          <Table bg="gray.50" variant="simple">
            <Thead>
              <Tr>
                <Th>Ad</Th>
                <Th>Soyad</Th>
                <Th>E-posta</Th>
              </Tr>
            </Thead>
            <Tbody>
              {recentClients.map((client) => (
                <Tr key={client.id}>
                  <Td>{client.name}</Td>
                  <Td>{client.surname}</Td>
                  <Td>{client.email}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </SimpleGrid>
    </Box>
  );
}
