import React from 'react';
import Canvas from './components/Canvas/Canvas';

interface IBall {
  x: number,
  y: number,
  r: number,
  angle1: number,
  angle2: number
}

function App() {

  return (
    <div>
      <Canvas width={window.innerWidth - 20} height={500} />
    </div>
  );
}

export default App;
