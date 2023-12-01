import { Flex, Image, useColorMode } from '@chakra-ui/react';
import userAtom from '../atoms/userAtom';
import { useRecoilValue } from 'recoil';
import {AiFillHome } from 'react-icons/ai';
import { RxAvatar } from "react-icons/rx";
import { Link } from 'react-router-dom';

const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const currentUser = useRecoilValue(userAtom); // Logged in user

  return (
    <Flex justifyContent="space-between" mt="6" mb="12">
      
      {currentUser && (
        <Link to="/">
          <AiFillHome size={24} />
        </Link>
      )}

      <Image
        cursor={"pointer"}
        w={6}
        alt="logo"
        src={colorMode === "dark" ? "/light-logo.svg" : "/dark-logo.svg"}
        onClick={toggleColorMode}
      />

      {currentUser && (
        <Link to={`/${currentUser.username}`}>
          <RxAvatar size={24} />
        </Link>
      )}

    </Flex>
  )
}

export default Header;