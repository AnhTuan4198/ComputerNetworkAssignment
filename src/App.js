import React from 'react';
import Layout from './Layout';
import './styles/app/App.css'




function App() {
  let Loading;
  Loading = setInterval(()=>{
    return false;
  },500)
  return (
    <div className="App">
      <Layout title="Let do it" />
    </div>
  );
}

export default App;
