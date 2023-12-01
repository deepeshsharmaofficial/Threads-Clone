import React, { useEffect, useState } from 'react';
import UserHeader from '../components/UserHeader';
import UserPost from '../components/UserPost';
import { useParams } from 'react-router-dom';
import useShowToast from '../hooks/useShowToast';
import { Flex, Spinner } from '@chakra-ui/react';

const UserPage = () => {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const showToast = useShowToast();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getUser = async() => {
      setLoading(true);
      try {
        const response = await fetch(`/api/users/profile/${username}`);
        const data = await response.json();
        console.log('user: ', data);
        if(data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setUser(data);
      } catch (error) {
        showToast("Error", error, "error");
      } finally {
        setLoading(false);
      }
    }

    getUser();
  }, [username]);

  if(!user && loading) {
    return (
      <Flex justifyContent="center">
        <Spinner size='xl' />
      </Flex>
      )
  }

  if(!user && !loading) {
    return (
      <Flex justifyContent="center">
        <h1 >User not found</h1>;
      </Flex>
    )
  }

  return (
    <div>
      <UserHeader user={user} />
      <UserPost postImg="/post1.png" postTitle="Let's talk about threads." likes={1200} replies={481}/>
      <UserPost postImg="/post2.png" postTitle="Nice Tutorial." likes={451} replies={251} />
      <UserPost postImg="/post3.png" postTitle="I love this guy." likes={321} replies={423} />
      <UserPost postTitle="This is my first threads." likes={212} replies={671} />
    </div>
  )
}

export default UserPage;