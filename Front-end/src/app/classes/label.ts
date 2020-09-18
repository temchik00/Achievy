import { Text, Shadow, Pattern, Gradient } from 'fabric/fabric-impl';

interface LabelOptions {
  text: string;
  posX: number;
  posY: number;
  fontFamily: string;
  fontSize: number;
  fontFill: string | Pattern | Gradient;
  isCompleted: boolean;
}

export class Label extends Text {
  private static uncompletedShadow: Shadow | string;
  private static completedShadow: Shadow | string;

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
    uncompletedShadow: Shadow | string,
    completedShadow: Shadow | string
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
