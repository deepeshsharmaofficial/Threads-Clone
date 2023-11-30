import { VStack, Flex, Box, Text, Avatar, Menu, MenuButton, MenuList, MenuItem, Portal, useToast, Icon, Button } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { BsInstagram } from "react-icons/bs";
import { CgMoreO } from "react-icons/cg";
import userAtom from '../atoms/userAtom';
import { useRecoilValue } from 'recoil';
import { useState } from 'react';
import useShowToast from '../hooks/useShowToast';

const UserHeader = ({user}) => {
  const toast = useToast();
  const currentUser = useRecoilValue(userAtom); // Logged in user
  const [following, setFollowing] = useState(user.followers.includes(currentUser._id));
  console.log('following: ', following);
  const showToast = useShowToast();
  const [updating, setUpdating] = useState(false);

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

  const handleFollowUnfollow = async() => {
    if(!currentUser) {
      showToast("Error", "Please login to follow", "error");
      return;
    }

    setUpdating(true);
    try {
      const res = await fetch(`/api/users/follow/${user._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      if(data.error) {
        showToast("Error", data.error, "error");
        return;
      }

      // TODO: need to do it by other way
      // It's only add to client side
      if(following) {
        showToast("Success", `Unfollowed ${user.name}`, "success");
        user.followers.pop();
      } else {
        showToast("Success", `Followed ${user.name}`, "success");
        user.followers.push(currentUser._id);
      }
  
      setFollowing(!following);

      console.log(data);

    } catch (error) {
      showToast("Error", error, "error");
    } finally {
      setUpdating(false);
    }
  }

  return (
    <div>
        <VStack gap="4" alignItems="start">
          
          <Flex justifyContent="space-between" w="full">
            <Box>
              <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight="bold">
                {user.name}
              </Text>
              <Flex gap="2" alignItems="center">
                <Text fontSize="sm"> {user.username} </Text>
                <Text fontSize="xs" bg="gray.dark" color="gray.light" p="1" borderRadius="full">
                  threads.net
                </Text>
              </Flex>
            </Box>
            <Box>
              {user.profilePic && <Avatar name={user.name} src={user.profilePic} size={{ base: "md", md: "xl" }} />}
              {!user.profilePic && <Avatar name={user.name} size={{ base: "md", md: "xl" }} />}
            </Box>
          </Flex>

          <Text>{user.bio}</Text>
          
          {/* Logged in User */}
          {currentUser._id === user._id && (
            <Link to="/updates">
              <Button size="sm">Update Profile</Button>
            </Link>
          )}

          {/* Not logged user show Follow / Unfollow Button */}
          {currentUser._id !== user._id && (
            <Button size="sm" onClick={handleFollowUnfollow} isLoading={updating}>
              {/* Follow */}
              {following ? "Unfollow" : "Follow"}
            </Button>
          )}

          <Flex w="full" justifyContent='space-between'>
            <Flex gap="2" alignItems="center">
              <Text fontSize={{ base: "sm", md: "md" }} color="gray.light">{user.followers.length} followers</Text>
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