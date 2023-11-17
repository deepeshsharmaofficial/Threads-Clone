import { VStack, Flex, Box, Text, Avatar, Menu, MenuButton, MenuList, MenuItem, Portal, useToast, Icon } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { BsInstagram } from "react-icons/bs";
import { CgMoreO } from "react-icons/cg";

const UserHeader = () => {
  const toast = useToast();

  const copyURL = () => {
    const currentURL = window.location.href;
    console.log('currentURL: ', currentURL);
    navigator.clipboard.writeText(currentURL).then(() => {
      toast({
        title: 'Profile link copied.',
        status: 'success',
        duration: 1000,
        isClosable: true,
      })
    })
  }

  return (
    <div>
        <VStack gap="4" alignItems="start">
          
          <Flex justifyContent="space-between" w="full">
            <Box>
              <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight="bold">
                Mark Zuckerberg
              </Text>
              <Flex gap="2" alignItems="center">
                <Text fontSize="sm">zuckerberg</Text>
                <Text fontSize="xs" bg="gray.dark" color="gray.light" p="1" borderRadius="full">
                  threads.net
                </Text>
              </Flex>
            </Box>
            <Box>
              <Avatar name="Mark Zuckerberg" src="/zuck-avatar.png" size={{ base: "md", md: "xl" }} />
            </Box>
          </Flex>

          <Text>Co-founder, executive chairman and CEO of Meta Platform.</Text>
          
          <Flex w="full" justifyContent='space-between'>
            <Flex gap="2" alignItems="center">
              <Text fontSize={{ base: "sm", md: "md" }} color="gray.light">3.2K followers</Text>
              <Box w="1" h="1" bg="gray.light" borderRadius="full"></Box>
              <Text fontSize={{ base: "sm", md: "md" }} >
                <Link bg={"gray.light"}>instagram.com</Link>
              </Text>
            </Flex>

            <Flex>
              <Box className="icon-container">
                <Icon as={BsInstagram} boxSize={{ base: "4", md: "6" }} cursor="pointer" />
              </Box>
              <Box className="icon-container">
                <Menu>
                  <MenuButton>
                      <Icon as={CgMoreO} boxSize={{ base: "4", md: "6" }} cursor="pointer" />
                      {/* <CgMoreO size="24" cursor="pointer" /> */}
                  </MenuButton>
                  <Portal>
                    <MenuList bg="gray.dark">
                      <MenuItem bg="gray.dark" onClick={copyURL}>
                        Copy link
                      </MenuItem>
                    </MenuList>
                  </Portal>
                </Menu>
              </Box>
            </Flex>
          </Flex>

          <Flex w="full">
            <Flex flex="1" borderBottom="1.5px solid white" justifyContent="center" pb="3" cursor="pointer">
              <Text fontSize={{ base: "sm", md: "md" }} fontWeight="bold">Threads</Text>
            </Flex>
            <Flex flex="1" borderBottom="1px solid gray" color="gray.light" justifyContent="center" pb="3" cursor="pointer">
              <Text fontSize={{ base: "sm", md: "md" }} fontWeight="bold">Replies</Text>
            </Flex>
          </Flex>

        </VStack>
    </div>
  )
}

export default UserHeader;