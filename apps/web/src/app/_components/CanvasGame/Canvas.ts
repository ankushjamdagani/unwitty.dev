type Vector2D = [number, number]
type Vector3D = [number, number, number]
type Vector4D = [number, number, number, number]

/**
 * Attributes in this order [x, y, width, height]
 */
type Box2D = Vector4D

export type PixelCanvasProps = {
  canvas: any,
  resolution: Vector2D,
  styles: {
    fillColor?: string,
    strokeColor?: string,
    strokeWidth?: number
  },
}

export class PixelCanvas {
  constructor(props: PixelCanvasProps) {
    this.props = props;

    this.props.context = props.canvas.getContext("2d") as CanvasRenderingContext2D;
  }

  getPixelBox(position: Vector2D): Box2D {
    const { canvas, resolution } = this.props;
    
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    
    const pixelWidth = canvasWidth / resolution[0]
    const pixelHeight = canvasHeight / resolution[1]
  
    return [
      position[0] * pixelWidth, 
      position[1] * pixelHeight, 
      pixelWidth,
      pixelHeight,
    ]
  }

  paintPixel(position: Vector2D) {
    const { canvas, styles, context } = this.props;
    const { fillColor = "#000", strokeColor = "#000", strokeWidth = 1 } = styles;
    
    const pixelBox = this.getPixelBox(position);
    
    context.fillStyle = fillColor;
    context.strokeStyle = strokeColor;
    context.lineWidth = strokeWidth;
    
    context.beginPath();
    context.rect(...pixelBox);
    
    context.fill();
    context.stroke();
  }

  clear() {
    const { context, canvas } = this.props;
    context.clearRect(0, 0, canvas.width, canvas.height)
  }
}

type flip = 1 | -1;

const NextOrientation: Record<string, [flip, flip]> = {
  "1,1": [-1,-1],
  "-1,-1": [1,-1],
  "1,-1": [-1,1],
  "-1,1": [1,1],
}

export class Tetris extends PixelCanvas {
  constructor(props) {
    super(props);
  }

  drawL(position: Vector2D, orientation: [flip, flip] = [1, 1]) {
    const pixels: Vector2D[] = [
      [position[0] - orientation[0], position[1] - orientation[1]],
      [position[0] - orientation[0], position[1]],
      [position[0], position[1]],
      [position[0] + orientation[0], position[1]],
    ]
    
    for (let pixel of pixels) {
      this.paintPixel(pixel)
    }
  }

  static getNextOrientation(orientation: [flip, flip]) {
    return NextOrientation[`${orientation}`]
  }
}