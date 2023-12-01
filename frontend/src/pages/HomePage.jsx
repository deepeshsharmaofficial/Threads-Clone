import React, { useEffect, useState } from 'react'
import useShowToast from '../hooks/useShowToast';
import { Flex, Spinner } from '@chakra-ui/react';
import Post from '../components/Post';

const HomePage = () => {
  const showToast = useShowToast();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getFeedPosts = async() => {
      setLoading(true);
      try {
        const response = await fetch('/api/posts/feed');
        const data = await response.json();
        console.log('posts: ', data);
        setPosts(data);

        if(data.error) {
          showToast("Error", data.error, "error");
          return;
        }
      } catch (error) {
        showToast("Error", error.message, "error");
      } finally {
        setLoading(false);
      }
    }

    getFeedPosts();

  }, [])

  return (
    <>
    {loading && (
      <Flex justifyContent="center">
        <Spinner size='xl' />
      </Flex>
    )}
    
    {!loading && posts.length === 0 && (
      <h1>Follow some users to see the feed</h1>
    )}

    {posts.map((post) => (
			<Post key={post._id} post={post} postedBy={post.postedBy} />
		))}

    </>
  )
}

export default HomePage;