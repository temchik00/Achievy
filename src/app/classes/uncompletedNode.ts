import { Shadow } from 'fabric/fabric-impl';
import { Node, NodeStates } from './node';
import { CompletedNode } from './completedNode';
import { Line } from './line';
import { Label } from './label';

export class UncompletedNode extends Node {
  private static activeShadow: string | Shadow;
  private static idleShadow: string | Shadow;
  private static activeStroke: string;
  private static idleStroke: string;
  private static activeStrokeWidth: number;
  private static hoverStrokeWidth: number;
  private static idleStrokeWidth: number;

  constructor(
    id: number,
    name: string,
    description: string,
    posX: number,
    posY: number,
    state: NodeStates = NodeStates.Idle,
    label?: Label
  ) {
    super(id, name, description, posX, posY, true, state, label);
    if (state === NodeStates.Idle) {
      this.setShadow(UncompletedNode.idleShadow);
      this.set('stroke', UncompletedNode.idleStroke);
      this.set('strokeWidth', UncompletedNode.idleStrokeWidth);
    } else {
      this.setShadow(UncompletedNode.activeShadow);
      this.set('stroke', UncompletedNode.activeStroke);
      this.set('strokeWidth', UncompletedNode.activeStrokeWidth);
    }
  }

  public static Init(
    activeShadow: string | Shadow,
    idleShadow: string | Shadow,
    activeStroke: string,
    idleStroke: string,
    activeStrokeWidth: number,
    hoverStrokeWidth: number,
    idleStrokeWidth: number
  ): void {
    UncompletedNode.activeShadow = activeShadow;
    UncompletedNode.idleShadow = idleShadow;
    UncompletedNode.activeStroke = activeStroke;
    UncompletedNode.idleStroke = idleStroke;
    UncompletedNode.activeStrokeWidth = activeStrokeWidth;
    UncompletedNode.hoverStrokeWidth = hoverStrokeWidth;
    UncompletedNode.idleStrokeWidth = idleStrokeWidth;
  }

  protected UpdateLines(): void {
    for (let i = 0; i < this.linesChild.length; i++) {
      const line: Line = this.linesChild[i];
      switch (line.target.isCompleted) {
        case true:
          line.SetActive();
          break;
        case false:
          line.SetSemiActive();
          break;
      }
    }

    for (let i = 0; i < this.linesParent.length; i++) {
      const line: Line = this.linesParent[i];
      if (line.source.isCompleted === true) {
        line.SetActive();
      }
    }
  }

  public CanBeToggled(): boolean {
    this.parents.forEach((parent) => {
      if (parent.isCompleted === true) {
        return true;
      }
    });
    return false;
  }

  public ToggleCompleted(): Node {
    if (!this.CanBeToggled()) {
      return null;
    }
    this.UpdateLines();
    this.label.SetCompleted();
    let completedNode = new CompletedNode(
      this.id,
      this.nodeName,
      this.description,
      this.left,
      this.top,
      this.state,
      this.label
    );
    for (let i = 0; i < this.linesChild.length; i++) {
      this.linesChild[i].source = completedNode;
    }
    for (let i = 0; i < this.linesParent.length; i++) {
      this.linesParent[i].target = completedNode;
    }
    return completedNode;
  }

  public SetIdle(): void {
    this.set('strokeWidth', UncompletedNode.idleStrokeWidth);
    this.set('stroke', UncompletedNode.idleStroke);
    this.animate('radius', UncompletedNode.idleSize, {
      onChange: UncompletedNode.canvas.renderAll.bind(UncompletedNode.canvas),
      duration: 50,
    });
    if (this.state === NodeStates.Active) {
      this.set('shadow', UncompletedNode.idleShadow);
    }
    this.state = NodeStates.Idle;
  }

  public SetHover(): void {
    this.set('strokeWidth', UncompletedNode.hoverStrokeWidth);
    this.set('stroke', UncompletedNode.activeStroke);
    this.animate('radius', UncompletedNode.activeSize, {
      onChange: UncompletedNode.canvas.renderAll.bind(UncompletedNode.canvas),
      duration: 50,
    });
    this.state = NodeStates.Hover;
  }

  public SetActive(): void {
    this.set('strokeWidth', UncompletedNode.activeStrokeWidth);
    this.set('shadow', UncompletedNode.activeShadow);
    this.state = NodeStates.Active;
  }
}
