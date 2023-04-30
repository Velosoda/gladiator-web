import './App.css';
import React from 'react'

function App() {
  const [word, setWord] = React.useState(null);
  const [associations, setAssociations] = React.useState(null);
  const getAssociations = () => {
    fetch('/hello')
    .then()
  };
  return (
    <div className="app">
      <button onClick={getAssociations}>Find Associations</button>
      {associations && (
        <h1> {word} </h1>
      )}
    </div>
  );
}
export default App;
