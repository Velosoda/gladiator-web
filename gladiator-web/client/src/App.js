import './App.css';
import * as React from 'react'
import { useState } from 'react';
import { LoginPage } from './pages/LoginPage';
import { Box } from '@mui/material';


export const App = () => {

  // const [posts, setPosts] = useState([{}]);

  // const getPosts = () => {
  //   fetch("/api/posts/").then(
  //     result => result.json()
  //   ).then(
  //     data => {
  //       setPosts(data)
  //     });
  //   console.log(posts);
  // };

  return (
    <Box>
      <LoginPage />
    </Box>
  );
}
