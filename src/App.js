import React from "react";
let MyComponent = () => <div style={{padding:20}}>Hello from Eve Console</div>;
try { MyComponent = require("./MyComponent").default || require("./MyComponent"); } catch (e) {}
export default function App() {
  return (
    <div>
      <h1 style={{margin:"16px"}}>Eve Console — Unified</h1>
      <MyComponent />
    </div>
  );
}
