import { Line as FabricLine, Shadow } from 'fabric/fabric-impl';
import { Node } from './node';

export class Line extends FabricLine {
  private static inactiveShadow: string | Shadow;
  private static semiActiveShadow: string | Shadow;
  private static activeShadow: string | Shadow;
  private static color: string;
  private static lineWidth: number;
  public source: Node;
  public target: Node;

  constructor(
    source: Node,
    target: Node
  ) {
    let lineShadow: string | Shadow; 
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
    inactiveShadow: string | Shadow,
    semiActiveShadow: string | Shadow,
    activeShadow: string | Shadow,
    color: string
  ): void {
    Line.inactiveShadow = inactiveShadow;
    Line.semiActiveShadow = semiActiveShadow;
    Line.activeShadow = activeShadow;
    Line.color = color;
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
