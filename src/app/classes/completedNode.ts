import { Shadow } from 'fabric/fabric-impl';
import { Node, NodeStates } from './node';
import { UncompletedNode } from './uncompletedNode';
import { Line } from './line';
import { Label } from './label';

export class CompletedNode extends Node {
  private static shadow: string | Shadow;
  private static stroke: string;
  private static idleStrokeWidth: number;
  private static activeStrokeWidth: number;
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
    this.setShadow(CompletedNode.shadow);
    this.set('stroke', CompletedNode.stroke);
    this.set(
      'strokeWidth',
      state === NodeStates.Idle
        ? CompletedNode.idleStrokeWidth
        : CompletedNode.activeStrokeWidth
    );
  }

  public static Init(
    shadow: string | Shadow,
    stroke: string,
    idleStrokeWidth: number,
    activeStrokeWidth: number
  ): void {
    CompletedNode.shadow = shadow;
    CompletedNode.stroke = stroke;
    CompletedNode.idleStrokeWidth = idleStrokeWidth;
    CompletedNode.activeStrokeWidth = activeStrokeWidth;
  }

  protected UpdateLines(): void {
    for (let i = 0; i < this.linesChild.length; i++) {
      this.linesChild[i].SetInactive();
    }

    for (let i = 0; i < this.linesParent.length; i++) {
      const line: Line = this.linesParent[i];
      if (line.source.isCompleted === true) {
        line.SetSemiActive();
      }
    }
  }

  public CanBeToggled(): boolean {
    for (let i = 0; i < this.childs.length; i++) {
      if (this.childs[i].isCompleted === false) {
        continue;
      }
      const child: Node = this.childs[i];
      let depends: boolean = true;
      for (let j = 0; j < child.parents.length; j++) {
        const parent: Node = child.parents[j];
        if (parent != this && parent.isCompleted === true) {
          depends = false;
          break;
        }
      }
      if (depends === true) {
        return false;
      }
    }
    return true;
  }

  public ToggleCompleted(): Node {
    if (!this.CanBeToggled()) {
      return null;
    }
    this.UpdateLines();
    this.label.SetUncompleted();
    let uncompletedNode = new UncompletedNode(
      this.id,
      this.nodeName,
      this.description,
      this.left,
      this.top,
      this.state,
      this.label
    );
    for (let i = 0; i < this.linesChild.length; i++) {
      this.linesChild[i].source = uncompletedNode;
    }
    for (let i = 0; i < this.linesParent.length; i++) {
      this.linesParent[i].target = uncompletedNode;
    }
    return uncompletedNode;
  }

  public SetIdle(): void {
    this.animate('radius', CompletedNode.idleSize, {
      onChange: CompletedNode.canvas.renderAll.bind(CompletedNode.canvas),
      duration: 50,
    });
    if (this.state === NodeStates.Active) {
      this.set('strokeWidth', CompletedNode.idleStrokeWidth);
    }
    this.state = NodeStates.Idle;
  }

  public SetHover(): void {
    this.animate('radius', CompletedNode.activeSize, {
      onChange: CompletedNode.canvas.renderAll.bind(CompletedNode.canvas),
      duration: 50,
    });
    this.state = NodeStates.Hover;
  }

  public SetActive(): void {
    this.set('strokeWidth', CompletedNode.activeStrokeWidth);
    this.state = NodeStates.Active;
  }
}
