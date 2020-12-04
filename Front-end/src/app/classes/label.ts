import { fabric } from 'fabric';

interface LabelOptions {
  text: string;
  posX: number;
  posY: number;
  fontFamily: string;
  fontSize: number;
  fontFill: string | fabric.Pattern | fabric.Gradient;
  isCompleted: boolean;
}

export class Label extends fabric.Text {
  private static uncompletedShadow: fabric.Shadow | string;
  private static completedShadow: fabric.Shadow | string;

  constructor({
    text,
    posX,
    posY,
    fontFamily,
    fontSize,
    fontFill,
    isCompleted,
  }: LabelOptions) {
    super(text, {
      originX: 'left',
      originY: 'bottom',
      fontFamily: fontFamily,
      hoverCursor: 'cursor',
      shadow:
        isCompleted === false ? Label.uncompletedShadow : Label.completedShadow,
      left: posX,
      top: posY,
      fontSize: fontSize,
      lockMovementX: true,
      lockMovementY: true,
      selectable: false,
      hasControls: false,
      hasBorders: false,
      hasRotatingPoint: false,
      minScaleLimit: 1,
      fill: fontFill,
    });
  }

  public static Init(
    uncompletedShadow: fabric.Shadow | string,
    completedShadow: fabric.Shadow | string
  ): void {
    Label.uncompletedShadow = uncompletedShadow;
    Label.completedShadow = completedShadow;
  }

  public SetCompleted(): void {
    this.setShadow(Label.completedShadow);
  }

  public SetUncompleted(): void {
    this.setShadow(Label.uncompletedShadow);
  }
}
