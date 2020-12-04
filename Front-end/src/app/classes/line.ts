import { fabric } from 'fabric';
import { Node } from './node';

export class Line extends fabric.Line {
  private static inactiveShadow: string | fabric.Shadow;
  private static semiActiveShadow: string | fabric.Shadow;
  private static activeShadow: string | fabric.Shadow;
  private static color: string;
  private static lineWidth: number;
  public source: Node;
  public target: Node;

  constructor(
    source: Node,
    target: Node
  ) {
    let lineShadow: string | fabric.Shadow; 
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

  public SetActive(): void {
    this.setShadow(Line.activeShadow);
  }

  public SetSemiActive(): void {
    this.setShadow(Line.semiActiveShadow);
  }

  public SetInactive(): void {
    this.setShadow(Line.inactiveShadow);
  }
}
