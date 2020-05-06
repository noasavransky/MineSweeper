import React from 'react';
import logo from './logo.svg';
import './App.css';
import GameHeader from './components/gameHeader';
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
