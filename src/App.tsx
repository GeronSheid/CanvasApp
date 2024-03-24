import React, { useEffect, useState } from 'react';
import Canvas from './components/Canvas/Canvas';
import { ModalWindow } from './components/ModalWindow/ModalWindow';

interface IBall {
  x: number,
  y: number,
  r: number,
  dx: number,
  dy: number,
  color: string
}

type ballsType = IBall[];

function App() {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [ballIndex, setBallIndex] = useState<number | null>(null);
  const [colorSeted, setColorSetted] = useState<boolean>(false);

  const [balls, setBalls] = useState<ballsType>([{ x: 100, y: 100, r: 30, dx: 0, dy: 0, color: 'rgb(255, 51, 0)' }, { x: 500, y: 400, r: 30, dx: 0, dy: 0, color: 'rgb(51, 153, 51)' }, { x: 400, y: 120, r: 40, dx: 0, dy: 0, color: 'rgb(0, 0, 255)' }])

  return (
    <>
    {modalVisible && 
      <>
        <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)'}}></div>
        <ModalWindow 
          ballIndex={ballIndex} 
          closeHandler={() => setModalVisible(false)} 
          setBallIndex={setBallIndex} 
          setBalls={setBalls}
          balls={balls}
        />
      </>
    }
      <Canvas width={window.innerWidth - 20} height={500} 
        setModalVisible={setModalVisible} 
        setBallIndex={setBallIndex} 
        modalVisible={modalVisible} 
        ballIndex={ballIndex} 
        balls={balls}/>
    </>
  );
}

export default App;
