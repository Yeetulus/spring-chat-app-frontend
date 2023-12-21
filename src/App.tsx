import React from 'react';
import './App.css';
import DemoChat from "./demo/DemoChat";
import DemoLogin from "./demo/DemoLogin";
import DemoMessageSender from "./demo/DemoMessageSender";
import DemoChatCreation from "./demo/DemoChatCreation";
import DemoRegister from "./demo/DemoRegister";

function App() {

    return (
    <div className="App">
        <DemoRegister></DemoRegister>
        <DemoLogin></DemoLogin>
        <DemoChatCreation></DemoChatCreation>
        <DemoChat></DemoChat>
        <DemoMessageSender></DemoMessageSender>
    </div>
  );
}

export default App;
