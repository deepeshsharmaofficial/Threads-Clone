import { Flex, Image, useColorMode } from '@chakra-ui/react';
import LogoutButton from './LogoutButton';

const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Flex justifyContent="center" mt="6" mb="12">
      <Image
        cursor={"pointer"}
        w={6}
        alt="logo"
        src={colorMode === "dark" ? "/light-logo.svg" : "/dark-logo.svg"}
        onClick={toggleColorMode}
      />
      <LogoutButton />
    </Flex>
  )
}

export default Header;