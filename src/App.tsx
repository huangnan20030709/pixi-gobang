import { Application } from 'pixi.js';
import { useEffect, useRef } from 'react';
import { paddimgTop } from './setting';
import { Chessboard } from './pojo/Chessboard';
function App() {
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    const app = new Application();

    await app.init({ background: '#DDB565', resizeTo: window });

    divRef.current?.appendChild(app.canvas);

    // 创建棋盘
    const chessboard = new Chessboard();
    chessboard.position.set((app.canvas.width - 15 * 50) / 2 - 35, paddimgTop);

    app.stage.addChild(chessboard);
  };

  return <div ref={divRef} style={{ width: '100vw', height: '100vh' }}></div>;
}

export default App;
