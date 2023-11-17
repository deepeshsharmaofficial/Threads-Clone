import React from 'react';
import UserHeader from '../components/UserHeader';
import UserPost from '../components/UserPost';

const UserPage = () => {
  return (
    <div>
      <UserHeader />
      <UserPost postImg="/post1.png" postTitle="Let's talk about threads." likes={1200} replies={481}/>
      <UserPost postImg="/post2.png" postTitle="Nice Tutorial." likes={451} replies={251} />
      <UserPost postImg="/post3.png" postTitle="I love this guy." likes={321} replies={423} />
      <UserPost postTitle="This is my first threads." likes={212} replies={671} />
    </div>
  )
}

export default UserPage;