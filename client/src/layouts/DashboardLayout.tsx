import React, { useState } from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import {
    Box,
    Flex,
    VStack,
    Heading,
    Text,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    useDisclosure,
    Drawer,
    DrawerBody,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    IconButton,
    useColorMode,
    useColorModeValue,
    HStack,
    Spacer,
    Avatar,  // Avatar'ı import ediyoruz
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { FiHome, FiUser, FiSettings } from "react-icons/fi";
import { BsThreeDotsVertical } from "react-icons/bs";
import Loading from "../components/Loading";

export default function DashboardLayout() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const navigate = useNavigate();
    const location = useLocation();
    const { colorMode, toggleColorMode } = useColorMode();
    const userName = "John Doe";
    const userEmail = "john.doe@example.com";

    const bgColor = useColorModeValue("white", "gray.800");
    const borderColor = useColorModeValue("gray.200", "gray.700");
    const textColor = useColorModeValue("gray.800", "white");
    const activeNavBg = useColorModeValue("blue.50", "blue.900");
    const activeNavColor = useColorModeValue("blue.500", "blue.200");

    const logoutColor = useColorModeValue("red.500", "red.100");
    const logoutHoverBg = useColorModeValue("red.100", "red.700");

    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = async () => {
        try {
            setIsLoggingOut(true);
            const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/auth/logout", {
                method: "POST",
                credentials: "include",
            });
            if (response.status === 200) {
                setTimeout(() => {
                    setIsLoggingOut(false);
                    navigate("/sign-in");
                }, 500);
            }
        } catch (error) {
            setIsLoggingOut(false);
            // Hata yönetimi burada yapılabilir
        }
    };

    const NavItem = ({ to, children, icon }: { to: string; children: React.ReactNode; icon: React.ReactElement }) => (
        <NavLink to={to}>
            <HStack
                py={1.5}
                px={3}
                borderRadius="md"
                fontSize="sm"
                fontWeight="medium"
                color={location.pathname === to ? activeNavColor : textColor}
                bg={location.pathname === to ? activeNavBg : "transparent"}
                _hover={{ bg: useColorModeValue("gray.100", "gray.700") }}
                spacing={3}
            >
                {React.cloneElement(icon, { size: 16 })}
                <Text>{children}</Text>
            </HStack>
        </NavLink>
    );

    const SidebarContent = () => (
        <VStack align="stretch" spacing={2}>
            <NavItem to="/dashboard" icon={<FiHome />}>Dashboard</NavItem>
            <NavItem to="/dashboard/profile" icon={<FiUser />}>Profile</NavItem>
            <NavItem to="/dashboard/settings" icon={<FiSettings />}>Settings</NavItem>
        </VStack>
    );

    if (isLoggingOut) {
        return (
            <Loading />
        );
    }

    return (
        <Flex h="100vh" bg={bgColor}>
            {/* Sidebar - desktop */}
            <Box
                display={{ base: "none", md: "flex" }}
                flexDirection="column"
                w="240px"
                bg={bgColor}
                borderRight="1px"
                borderColor={borderColor}
            >
                <VStack align="stretch" p={3} mt={3} spacing={6} flex={1}>
                    <Box textAlign="center" width="100%">
                        <Heading size="md" color={textColor}>Dashboard</Heading>
                    </Box>
                    <SidebarContent />
                    <Spacer />
                    <HStack justify="space-between" align="center">
                        <HStack spacing={3}>
                            <Avatar name={userName} size="sm" bg="blue.500" color="white" />
                            <VStack align="start" spacing={0}>
                                <Text fontSize="xs" fontWeight="bold">{userName}</Text>
                                <Text fontSize="xs">{userEmail}</Text>
                            </VStack>
                        </HStack>
                        <Menu>
                            <MenuButton
                                as={IconButton}
                                icon={<BsThreeDotsVertical />}
                                variant="ghost"
                                size="sm"
                            />
                            <MenuList>
                                <MenuItem onClick={toggleColorMode}>
                                    {colorMode === 'light' ? 'Dark Mode' : 'Light Mode'}
                                </MenuItem>
                                <MenuItem onClick={() => navigate("/settings")}>Ayarlar</MenuItem>
                                <MenuItem
                                    onClick={handleLogout}
                                    color={logoutColor}
                                    _hover={{ bg: logoutHoverBg }}
                                >
                                    Çıkış Yap
                                </MenuItem>
                            </MenuList>
                        </Menu>
                    </HStack>
                </VStack>
            </Box>

            {/* Main content area */}
            <Flex flex={1} direction="column">
                {/* Mobile menu button */}
                <Box display={{ base: "block", md: "none" }} p={2}>
                    <IconButton
                        icon={<HamburgerIcon />}
                        variant="outline"
                        size="sm"
                        onClick={onOpen}
                        aria-label="Open menu"
                    />
                </Box>

                {/* Page content */}
                <Box flex={1} p={6} overflowY="auto" bg={bgColor} color={textColor}>
                    <Outlet />
                </Box>
            </Flex>

            {/* Sidebar - mobile */}
            <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
                <DrawerOverlay />
                <DrawerContent bg={bgColor}>
                    <DrawerCloseButton />
                    <DrawerHeader color={textColor}>Dashboard</DrawerHeader>
                    <DrawerBody>
                        <VStack align="stretch" spacing={6}>
                            <SidebarContent />
                            <Spacer />
                            <HStack justify="space-between" align="center">
                                <HStack spacing={3}>
                                    <Avatar name={userName} size="sm" bg="blue.500" color="white" />
                                    <VStack align="start" spacing={0}>
                                        <Text fontSize="xs" fontWeight="bold">{userName}</Text>
                                        <Text fontSize="xs">{userEmail}</Text>
                                    </VStack>
                                </HStack>
                                <Menu>
                                    <MenuButton
                                        as={IconButton}
                                        icon={<BsThreeDotsVertical />}
                                        variant="ghost"
                                        size="sm"
                                    />
                                    <MenuList>
                                        <MenuItem onClick={toggleColorMode}>
                                            {colorMode === 'light' ? 'Dark Mode' : 'Light Mode'}
                                        </MenuItem>
                                        <MenuItem onClick={() => navigate("/settings")}>Ayarlar</MenuItem>
                                        <MenuItem
                                            onClick={handleLogout}
                                            color={logoutColor}
                                            _hover={{ bg: logoutHoverBg }}
                                        >
                                            Çıkış Yap
                                        </MenuItem>
                                    </MenuList>
                                </Menu>
                            </HStack>
                        </VStack>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </Flex>
    );
}