import { Color, Container, FillGradient, Graphics, Text, TextStyle } from 'pixi.js';
import TouchableText from '../base/ui/TouchableText';

interface ChessPoint {
  state: number;
}

export class Chessboard extends Container {
  isBlacking = true;

  meth: ChessPoint[][] = new Array(15).fill(0).map(() => new Array(15).fill(0).map(() => ({ state: 0 })));

  //设置右边文字
  setCurText: (str: string) => void = () => {};

  constructor() {
    super();
    this.render();
  }

  drawPoint(x: number, y: number, size: number, clickCB: () => void) {
    //添加网格点
    const basePoint = new Graphics();
    basePoint.beginFill('#0000FF');
    basePoint.drawCircle(x, y, size / 2);
    basePoint.endFill();
    basePoint.zIndex = 999;
    this.addChild(basePoint);

    //在网格点添加一个面积更大的透明区域，方便点击
    const touchPoint = new Graphics();
    touchPoint.beginFill('#000');
    touchPoint.drawCircle(x, y, size * 1.5);
    touchPoint.endFill();
    touchPoint.zIndex = 1000;
    touchPoint.alpha = 0;
    touchPoint.cursor = 'pointer';
    this.addChild(touchPoint);
    touchPoint.on('pointerover', () => {
      touchPoint.clear();
      touchPoint.beginFill(this.isBlacking ? '#000' : '#fff');
      touchPoint.drawCircle(x, y, size * 1.5);
      touchPoint.endFill();
      touchPoint.alpha = 0.8;
    });
    touchPoint.on('pointerout', () => {
      touchPoint.alpha = 0;
    });
    //添加事件
    touchPoint.interactive = true;
    touchPoint.once('pointerdown', () => {
      //添加黑白棋子
      const markPoint = new Graphics();
      markPoint.beginFill(this.isBlacking ? '#000' : '#fff');
      markPoint.drawCircle(x, y, size * 2.5);
      markPoint.endFill();
      markPoint.zIndex = 9999;
      this.addChild(markPoint);
      clickCB();
      touchPoint.cursor = 'default';
    });
  }

  drawLine(x1: number, y1: number, x2: number, y2: number) {
    let line = new Graphics();
    line.moveTo(x1, y1);
    line.lineTo(x2, y2);
    line.fillStyle = 0x000000;
    line.stroke();
    this.addChild(line);
  }
  renderText() {
    const fill = new FillGradient(0, 0, 0, 36 * 1.7 * 7);
    const colors = [0xffffff, 0x00ff99].map((color) => Color.shared.setValue(color).toNumber());

    colors.forEach((number, index) => {
      const ratio = index / colors.length;

      fill.addColorStop(ratio, number);
    });
    const style = new TextStyle({
      fontFamily: 'Arial',
      fontSize: 36,
      fontStyle: 'italic',
      fontWeight: 'bold',
      fill: { fill },
      stroke: { color: '#4a1850', width: 5, join: 'round' },
      dropShadow: {
        color: '#000000',
        blur: 4,
        angle: Math.PI / 6,
        distance: 6
      },
      wordWrap: true,
      wordWrapWidth: 180,
      breakWords: true,
      align: 'center'
    });
    const richText = new Text('当前回合:黑方', style);
    richText.x = this.width;
    richText.y = 50;

    this.addChild(richText);

    this.setCurText = (str) => {
      richText.text = '当前回合:' + str;
    };
  }

  // 初始化方法
  render() {
    for (let i = 0; i < this.meth.length; i++) {
      this.drawLine(0, i * 50, 14 * 50, i * 50);
      this.drawLine(i * 50, 0, i * 50, 14 * 50);
      for (let j = 0; j < this.meth[1].length; j++) {
        this.drawPoint(j * 50, i * 50, 6, () => {
          this.meth[i][j].state = this.isBlacking ? 1 : 2;

          if (this.checkWin(this.meth[i][j].state, i, j)) {
            this.popWinMsg(this.isBlacking ? '黑方' : '白方');
            this.isBlacking = true;
            return;
          }
          this.isBlacking = !this.isBlacking;
          this.setCurText(this.isBlacking ? '黑方' : '白方');
        });
      }
    }
    this.renderText();
  }
  checkWin(state: number, i: number, j: number): boolean {
    // 检查横向
    let count = 1;

    for (let i1 = i + 1; i1 < this.meth.length; i1++) {
      if (this.meth[i1][j].state === state) {
        count++;
      } else {
        break;
      }
    }
    if (count >= 5) return true;

    for (let i1 = i - 1; i1 >= 0; i1--) {
      if (this.meth[i1][j].state === state) {
        count++;
      } else {
        break;
      }
    }
    if (count >= 5) return true;

    // 检查纵向
    count = 1;
    for (let j1 = j + 1; j1 < this.meth.length; j1++) {
      if (this.meth[i][j1].state === state) {
        count++;
      } else {
        break;
      }
    }
    if (count >= 5) return true;

    for (let j1 = j - 1; j1 >= 0; j1--) {
      if (this.meth[i][j1].state === state) {
        count++;
      } else {
        break;
      }
    }
    if (count >= 5) return true;

    // 检查左上到右下
    count = 1;
    for (let i1 = i - 1, j1 = j - 1; j1 >= 0 && i1 >= 0; i1--, j1--) {
      if (this.meth[i1][j1].state === state) {
        count++;
      } else {
        break;
      }
    }
    if (count >= 5) return true;

    for (let i1 = i + 1, j1 = j + 1; j1 < this.meth.length && i1 < this.meth.length; i1++, j1++) {
      if (this.meth[i1][j1].state === state) {
        count++;
      } else {
        break;
      }
    }
    if (count >= 5) return true;

    // 检查右上到左下
    count = 1;
    for (let i1 = i - 1, j1 = j + 1; i1 >= 0 && j1 < this.meth.length; i1--, j1++) {
      if (this.meth[i1][j1].state === state) {
        count++;
      } else {
        break;
      }
    }
    if (count >= 5) return true;

    for (let i1 = i + 1, j1 = j - 1; i1 < this.meth.length && j1 >= 0; i1++, j1--) {
      if (this.meth[i1][j1].state === state) {
        count++;
      } else {
        break;
      }
    }
    if (count >= 5) return true;

    //最后四个方向都没找到
    return false;
  }

  // 展示胜利信息
  popWinMsg(msg: string) {
    // 创建一个遮罩
    const layout = new Graphics();
    layout.zIndex = 9999999;
    layout.beginFill(0x000000);
    layout.alpha = 0;
    layout.drawRect(0, 0, this.width, this.height);
    layout.endFill();
    layout.interactive = true; //设置为true，可以阻止事件穿透
    this.addChild(layout);

    // 创建一个窗口
    const win = new Graphics();
    win.beginFill(0x000000, 0.5);
    win.drawRect(0, 0, 500, 200);
    win.endFill();
    win.x = this.width / 2 - win.width / 2;
    win.y = 180;
    win.zIndex = 10000000;
    this.addChild(win);

    const skewStyle = new TextStyle({
      fontFamily: 'Arial',
      dropShadow: {
        alpha: 0.8,
        angle: 2.1,
        blur: 2,
        color: '0x111111',
        distance: 10
      },
      fill: '#ffffff',
      stroke: { color: '#00a620', width: 6, join: 'round' },
      fontSize: 60,
      fontWeight: 'lighter'
    });

    const skewText = new Text({
      text: msg + '胜利',
      style: skewStyle
    });
    skewText.eventMode = 'dynamic';
    skewText.anchor.set(0.5, 0.5);
    skewText.x = win.width / 2 - 60;
    skewText.y = 60;

    win.addChild(skewText);

    //创建一个再来一次的按钮
    const fill = new FillGradient(0, 0, 0, 36 * 1.7 * 7);
    const style = new TextStyle({
      fontFamily: 'Arial',
      fontSize: 40,
      fontStyle: 'italic',
      fontWeight: 'bold',
      fill: { fill },
      stroke: { color: '#4a1850', width: 5, join: 'round' },
      wordWrap: true,
      wordWrapWidth: 440
    });

    const richText = new TouchableText('再来一次', style, () => {
      this.reStart();
    });

    richText.x = win.width - richText.width - 30;
    richText.y = win.height - richText.height - 30;

    win.addChild(richText);
  }

  reStart() {
    this.meth = new Array(15).fill(0).map(() => new Array(15).fill(0).map(() => ({ state: 0 })));
    this.removeChildren();
    this.render();
  }
}
