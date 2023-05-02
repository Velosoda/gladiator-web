import './App.css';
import * as React from 'react'
import { useState } from 'react';


export const TestComponent = () => {

  const [posts, setPosts] = useState([{}]);

  // useEffect(() => {
  //   fetch("/api/posts/").then(
  //     result => result.json()
  //   ).then(
  //     data => {
  //       setPosts(data)
  //     });
  // }, [])

  const getPosts = () => {
    fetch("/api/posts/").then(
      result => result.json()
    ).then(
      data => {
        setPosts(data)
      });
    console.log(posts);
  };

  return (
    <div className="app">
      <button onClick={getPosts}>Get Posts</button>
      {(typeof posts.posts === 'undefined') ? (
        <p>loading....</p>
      ):(
        posts.posts.map((post, i) => (
          <div key={i}>
          <p>[id: {post.id}]</p>
          <p>[title: {post.title}]</p>
        </div>
        ))
      )}
    </div>
  );
}
