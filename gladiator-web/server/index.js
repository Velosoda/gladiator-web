const express = require('express');
const app = express();
const port = 3001;

app.get('/api/posts', (req, res) => {
  const posts = [
    { id: 1, title: 'Post 1' },
    { id: 2, title: 'Post 2' },
    { id: 3, title: 'Post 3' }
  ];
  res.json(posts);
});

app.get('/hello', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});