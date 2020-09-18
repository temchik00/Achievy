import { Circle, Canvas, Pattern, Gradient } from 'fabric/fabric-impl';
import { Label } from './label';
import { Line } from './line';

export enum NodeStates {
  Idle,
  Hover,
  Active,
}

export abstract class Node extends Circle {
  protected static idleSize: number;
  protected static activeSize: number;
  protected static fill: string | Pattern | Gradient;
  protected static canvas: Canvas;

  public label: Label;
  public id: number;
  public nodeName: string;
  public description: string;
  public isCompleted: boolean;
  public state: NodeStates;

  public parents: Node[];
  public childs: Node[];
  public linesParent: Line[];
  public linesChild: Line[];

  constructor(
    id: number,
    name: string,
    description: string,
    posX: number,
    posY: number,
    isCompleted: boolean,
    state: NodeStates = NodeStates.Idle,
    label?: Label
  ) {
    super({
      radius: state === NodeStates.Active ? Node.activeSize : Node.idleSize,
      left: posX,
      top: posY,
      fill: Node.fill,
      hoverCursor: 'pointer',
      originX: 'center',
      originY: 'center',
      lockMovementX: true,
      lockMovementY: true,
      lockRotation: true,
      selectable: false,
      hasControls: false,
      hasBorders: false,
      hasRotatingPoint: false,
    });
    this.id = id;
    this.nodeName = name;
    this.description = description;
    this.isCompleted = isCompleted;
    this.state = state;
    if (label) {
      this.label = label;
    } else {
      this.label = new Label({
        text: name,
        posX: posX + this.radius * 1.2,
        posY: posY - this.radius * 0.6,
        fontFamily: 'Comic Sans',
        fontSize: 22,
        fontFill: 'rgb(220, 220, 220)',
        isCompleted: isCompleted,
      });
    }
  }

  public static InitNode(
    idleSize: number,
    activeSize: number,
    fill: string | Pattern | Gradient,
    canvas: Canvas
  ) {
    Node.idleSize = idleSize;
    Node.activeSize = activeSize;
    Node.fill = fill;
    Node.canvas = canvas;
  }

  public AddParent(parentNode: Node): void {
    if (!this.parents.includes(parentNode)) {
      this.parents.push(parentNode);
    }
  }

  public AddChild(childNode: Node): void {
    if (!this.childs.includes(childNode)) {
      this.childs.push(childNode);
    }
  }

  public AddParentLine(parentLine: Line) {
    if (!this.linesParent.includes(parentLine)) {
      this.linesParent.push(parentLine);
    }
  }

  public AddChildLine(childLine: Line) {
    if (!this.linesChild.includes(childLine)) {
      this.linesChild.push(childLine);
    }
  }

  protected abstract UpdateLines(): void;
  public abstract CanBeToggled(): boolean;
  public abstract ToggleCompleted(): Node;
  public abstract SetIdle(): void;
  public abstract SetHover(): void;
  public abstract SetActive(): void;
}
