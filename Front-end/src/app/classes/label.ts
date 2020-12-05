import { fabric } from 'fabric';

/**
 * Interface that passes down options into constructor.
 */
interface LabelOptions {
  /**
   * Text thst will be shown.
   */
  text: string;
  /**
   * X coordinate of the label.
   */
  posX: number;
  /**
   * Y coordinate of the label.
   */
  posY: number;
  /**
   * Font family.
   */
  fontFamily: string;
  /**
   * Size of the text.
   */
  fontSize: number;
  /**
   * Inside color of the font.
   */
  fontFill: string | fabric.Pattern | fabric.Gradient;
  /**
   * Shows whether label's node is complete or not.
   */
  isCompleted: boolean;
}

/**
 * Class that represents label.
 */
export class Label extends fabric.Text {
  /**
   * Shadow of the text when label's node is uncomplete.
   */
  private static uncompletedShadow: fabric.Shadow | string;
  
  /**
   * Shadow of the text when label's node is complete.
   */
  private static completedShadow: fabric.Shadow | string;

  /**
   * Constructor of the label
   * Parameters for the label.
   */
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

  /**
   * Initializes all static parameters
   * @param {fabric.Shadow | string} uncompletedShadow Shadow of the text when label's node is uncomplete.
   * @param {fabric.Shadow | string} completedShadow Shadow of the text when label's node is complete. 
   */
  public static Init(
    uncompletedShadow: fabric.Shadow | string,
    completedShadow: fabric.Shadow | string
  ): void {
    Label.uncompletedShadow = uncompletedShadow;
    Label.completedShadow = completedShadow;
  }

  /**
   * Makes label look completed.
   */
  public SetCompleted(): void {
    this.setShadow(Label.completedShadow);
  }

  /**
   * Makes label look uncompleted.
   */
  public SetUncompleted(): void {
    this.setShadow(Label.uncompletedShadow);
  }
}
