import React from 'react';
import './App.css';
import DemoChat from "./demo/DemoChat";
import DemoLogin from "./demo/DemoLogin";
import DemoMessageSender from "./demo/DemoMessageSender";

function App() {
  return (
    <div className="App">
        <DemoLogin></DemoLogin>
        <DemoChat></DemoChat>
        <DemoMessageSender></DemoMessageSender>
    </div>
  );
}

export default App;
