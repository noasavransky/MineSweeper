import React from 'react';
import './App.css';
import GameBody from './components/gameBody';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <GameBody className="Game-body"></GameBody>
      </header>      
    </div>
  );
}

export default App;
