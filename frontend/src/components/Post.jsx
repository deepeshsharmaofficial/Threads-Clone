import { Avatar, Box, Flex, Image, Text } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { BsThreeDots } from "react-icons/bs";
import useShowToast from '../hooks/useShowToast';
import Actions from "./Actions";
import { formatDistanceToNow } from "date-fns";

import { useEffect, useState } from 'react';

const Post = ({ post, postedBy }) => {
  const [liked, setLiked] = useState(false);
	const [user, setUser] = useState(null);
	const showToast = useShowToast();

  const navigate = useNavigate();

  console.log("per post : ", post);

  useEffect(() => {

		const getUser = async () => {
			try {
				const res = await fetch("/api/users/profile/" + postedBy);
				const data = await res.json();
				
        console.log(data);

				if (data.error) {
					showToast("Error", data.error, "error");
					return;
				}
        setUser(data);

			} catch (error) {
				showToast("Error", error.message, "error");
				setUser(null);
			}
		};

    getUser();

	}, [postedBy]);

  if (!user) return null;

  return (
    <>
      <Link to={`${user.username}/post/${post._id}`}>
        <Flex gap="3" mb="4" py="5">
          <Flex flexDirection="column" alignItems="center">
            <Avatar
              size={{ base: "sm", md: "md" }}
              name={user?.name}
              src={user?.profilePic}
              onClick={(e) => {
                e.preventDefault();
                navigate(`${user.username}`);
              }}
            />
            <Box w="1px" h="full" bg="gray.light" my="2"></Box>
            <Box position="relative" w="full">

              {post.replies.length === 0 && <Text textAlign="center">🥱</Text>}
              
              {post.replies[0] && (
                <Avatar
                  size='xs'
                  name={post.replies[0].username}
                  src={post.replies[0].userProfilePic}
                  position="absolute"
                  bottom="0px"
                  right={{ base: "0px", md: "-5px" }}
                  padding="2px"
                />
              )}

              {post.replies[1] && (
                <Avatar
                  size={{ base: "2xs", md: "xs" }}
                  name={post.replies[1].username}
                  src={post.replies[1].userProfilePic}
                  position="absolute"
                  bottom={{ base: "-3px", md: "0px" }}
                  left={{ base: "-8.5px", md: "4px" }}
                  padding="2px"
                />
              )}

              {post.replies[2] && (
                <Avatar
                  size={{ base: "2xs", md: "xs" }}
                  name={post.replies[2].username}
                  src={post.replies[2].userProfilePic}
                  position="absolute"
                  top={{ base: "0px", md: "0px" }}
                  left={{ base: "5px", md: "15px" }}
                  padding="2px"
                />
              )}
              
            </Box>
          </Flex>

          <Flex flex="1" flexDirection="column" gap="2">
            <Flex justifyContent="space-between" w="full">
              <Flex w="full" alignItems="center">
                <Text
                  fontSize="sm"
                  fontWeight="bold"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(`${user.username}`);
                  }}
                >
                  {user?.username}
                </Text>
                <Image src="/verified.png" w="4" h="4" ml="1" />
              </Flex>
              <Flex gap="4" alignItems="center">
                <Text fontSize="xs" width="36" textAlign="right" color="gray.light">
                  {formatDistanceToNow(new Date(post.createdAt))} ago
                </Text>
                <BsThreeDots />
              </Flex>
            </Flex>

            <Text fontSize="sm">{post.text}</Text>
            {post.img && (
              <Box borderRadius="6" overflow="hidden" border="1px solid" borderColor="gray.light">
                <Image src={post.img} w="full" />
              </Box>
            )}
            
            <Flex gap="3" my="1">
              <Actions liked={liked} setLiked={setLiked} />
            </Flex>

            <Flex gap="2" alignItems="center">
              <Text color="gray.light" fontSize="sm">{post.replies.length} replies</Text>
              <Box w="0.5" h="0.5" borderRadius="full" bg="gray.light"></Box>
              <Text color="gray.light" fontSize="sm">{post.likes.length} likes</Text>
            </Flex>

          </Flex>
        </Flex>
      </Link>
    
    </>
  )
}

export default Post;