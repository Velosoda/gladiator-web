import './App.css';
import React from 'react'

function App() {
  const [posts, setPosts] = React.useState(null);
  const getPosts = () => {
    fetch('/api/posts/')
      .then(result => result.json())
      .then(body => setPosts(body));
  };
  return (
    <div className="app">
      <button onClick={getPosts}>Get Posts</button>
    </div>
  );
}
export default App;
