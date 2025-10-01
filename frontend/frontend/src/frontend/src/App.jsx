import { useState } from "react";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <h1>Welcome to Vixity</h1>
      <p>This is your frontend running on React + Vite 🎉</p>
      <button onClick={() => setCount(count + 1)}>
        You clicked {count} times
      </button>
    </div>
  );
}

export default App;
