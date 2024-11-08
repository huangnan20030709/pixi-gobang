import { Application } from 'pixi.js';
import React, { useEffect, useRef } from 'react';

import { Chessboard } from './pojo/Chessboard';
import { paddimgTop } from './setting';
function App() {
  const divRef = useRef<HTMLDivElement>(null);

  // const a = 1;

  const init = async () => {
    const app = new Application();

    await app.init({ background: '#DDB565', resizeTo: window });

    divRef.current?.appendChild(app.canvas);

    // 创建棋盘
    const chessboard = new Chessboard();
    chessboard.position.set((app.canvas.width - 15 * 50) / 2 - 35, paddimgTop);

    app.stage.addChild(chessboard);
  };

  useEffect(() => {
    init();
  }, []);

  return <div ref={divRef} style={{ width: '100vw', height: '100vh' }}></div>;
}

export default App;
