import React, { useState, useEffect } from "react";
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
    DrawerContent,
    DrawerCloseButton,
    IconButton,
    useColorMode,
    useColorModeValue,
    HStack,
    Spacer,
    Avatar,
    useToast,
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { FiHome, FiUser, FiSettings } from "react-icons/fi";
import { BsThreeDotsVertical } from "react-icons/bs";
import Loading from "../components/Loading";
import AuthWrapper from "../wrappers/AuthWrapper";
import { ChevronRightIcon } from "@chakra-ui/icons";

function DashboardLayout() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const navigate = useNavigate();
    const location = useLocation();
    const { colorMode, toggleColorMode } = useColorMode();
    const [userName, setUserName] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const toast = useToast();

    const bgColor = useColorModeValue("white", "gray.800");
    const borderColor = useColorModeValue("gray.200", "gray.700");
    const textColor = useColorModeValue("gray.800", "white");
    const activeNavBg = useColorModeValue("blue.50", "blue.900");
    const activeNavColor = useColorModeValue("blue.500", "blue.200");

    const logoutColor = useColorModeValue("red.500", "red.100");
    const logoutHoverBg = useColorModeValue("red.100", "red.700");

    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (isMobile) {
            onClose();
        }
    }, [location, isMobile, onClose]);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/auth/verify", {
                    method: "POST",
                    credentials: "include",
                });
                if (response.ok) {
                    const data = await response.json();
                    console.log(data);
                    
                    setUserName(data.user.username);
                    setUserEmail(data.user.email);
                } else {
                    throw new Error("Kullanıcı bilgileri alınamadı");
                }
            } catch (error) {
                console.error("Kullanıcı bilgileri alınırken hata oluştu:", error);
                toast({
                    title: "Hata",
                    description: "Kullanıcı bilgileri alınamadı. Lütfen tekrar giriş yapın.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
                navigate("/sign-in");
            }
        };

        fetchUserInfo();
    }, [navigate, toast]);

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
        <NavLink to={to} onClick={isMobile ? onClose : undefined}>
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

    const getBreadcrumbs = () => {
        const pathnames = location.pathname.split("/").filter((x) => x);
        return pathnames.map((name, index) => {
            // Dashboard'ı her zaman atlıyoruz çünkü zaten sabit olarak ekliyoruz
            if (name.toLowerCase() === 'dashboard') {
                return null;
            }
            const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
            const isLast = index === pathnames.length - 1;
            return (
                <BreadcrumbItem key={name} isCurrentPage={isLast}>
                    <BreadcrumbLink 
                        as={NavLink} 
                        to={routeTo} 
                        color={isLast ? activeNavColor : textColor}
                        fontSize="sm" 
                        fontWeight={isLast ? "bold" : "normal"}
                        _activeLink={{
                            color: activeNavColor,
                            fontWeight: "bold"
                        }}
                    >
                        {name.charAt(0).toUpperCase() + name.slice(1)}
                    </BreadcrumbLink>
                </BreadcrumbItem>
            );
        }).filter(Boolean); // null değerleri filtreliyoruz
    };

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

                {/* Breadcrumb */}
                <Box p={4}>
                    <Breadcrumb spacing="8px" separator={<ChevronRightIcon color="gray.500" />}>
                        <BreadcrumbItem>
                            <BreadcrumbLink 
                                as={NavLink} 
                                to="/dashboard" 
                                color={textColor}
                                fontSize="sm" 
                                fontWeight={location.pathname === "/dashboard" ? "bold" : "normal"}
                                _activeLink={{
                                    color: activeNavColor,
                                    fontWeight: "bold"
                                }}
                            >
                                Dashboard
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        {getBreadcrumbs()}
                    </Breadcrumb>
                </Box>

                {/* Page content */}
                <Box flex={1} p={6} overflowY="auto" bg={bgColor} color={textColor}>
                    <Outlet />
                </Box>
            </Flex>

            {/* Sidebar - mobile */}
            <Drawer 
                isOpen={isOpen} 
                placement="left" 
                onClose={onClose}
                blockScrollOnMount={false}
                trapFocus={false}
            >
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

export default AuthWrapper(DashboardLayout);