import { fabric } from 'fabric';
import { Node } from './node';

/**
 * Class that represents line.
 */
export class Line extends fabric.Line {
  /**
   * Shadow of the line when both target and source nodes are uncompleted.
   */
  private static inactiveShadow: string | fabric.Shadow;
  /**
   * Shadow of the line when only source is completed but target node is uncompleted.
   */
  private static semiActiveShadow: string | fabric.Shadow;
  /**
   * Shadow of the line when both target and source nodes are completed.
   */
  private static activeShadow: string | fabric.Shadow;
  /**
   * Color of the line.
   */
  private static color: string;
  /**
   * Width of the line.
   */
  private static lineWidth: number;
  /**
   * Instance of the node where line comes from.
   */
  public source: Node;
  /**
   * Instance of the node where line comes in.
   */
  public target: Node;

  /**
   * Constructor for the line
   * @param source Instance of the node where line comes from.
   * @param target Instance of the node where line comes in.
   */
  constructor(
    source: Node,
    target: Node
  ) {
    let lineShadow: string | fabric.Shadow; 
    /**
     * Defines visuals of the line based on source and target nodes.
     */
    if(source.isCompleted){
      if(target.isCompleted){
        lineShadow = Line.activeShadow;
      }else{
        lineShadow = Line.semiActiveShadow;
      }
    }else{
      lineShadow = Line.inactiveShadow;
    }
    super([source.left, source.top, target.left, target.top], {
      stroke: Line.color,
      strokeWidth: Line.lineWidth,
      selectable: false,
      evented: false,
      shadow: lineShadow,
    });
    this.source = source;
    this.target = target;
  }

  /**
   * Initializes all static parameters
   * @param {string | fabric.Shadow} inactiveShadow Shadow of the line when both target and source nodes are uncompleted.
   * @param {string | fabric.Shadow} semiActiveShadow Shadow of the line when only source is completed but target node is uncompleted.
   * @param {string | fabric.Shadow} activeShadow Shadow of the line when both target and source nodes are completed.
   * @param {string} color Color of the line. 
   * @param {number} width Width of the line.
   */
  public static Init(
    inactiveShadow: string | fabric.Shadow,
    semiActiveShadow: string | fabric.Shadow,
    activeShadow: string | fabric.Shadow,
    color: string,
    width: number
  ): void {
    Line.inactiveShadow = inactiveShadow;
    Line.semiActiveShadow = semiActiveShadow;
    Line.activeShadow = activeShadow;
    Line.color = color;
    Line.lineWidth = width;
  }

  /**
   * Make line looks active.
   */
  public SetActive(): void {
    this.setShadow(Line.activeShadow);
  }

  /**
   * Make line looks semiactive.
   */
  public SetSemiActive(): void {
    this.setShadow(Line.semiActiveShadow);
  }

  /**
   * Make line looks inactive.
   */
  public SetInactive(): void {
    this.setShadow(Line.inactiveShadow);
  }
}
