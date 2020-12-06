import { Shadow } from 'fabric/fabric-impl';
import { Node, NodeStates } from './node';
import { UncompletedNode } from './uncompletedNode';
import { Line } from './line';
import { Label } from './label';
import { NodeWrapper } from './node-wrapper';

/**
 * Class that represents completed node.
 */
export class CompletedNode extends Node {
  /**
   * Shadow of the node.
   */
  private static shadow: string | Shadow;
  /**
   * Color of the stroke.
   */
  private static stroke: string;
  /**
   * Width of the stroke when node is in idle or hover state.
   */
  private static idleStrokeWidth: number;
  /**
   * Width of the stroke when node is in active state.
   */
  private static activeStrokeWidth: number;

  /**
   * Constructor of the node
   * @param {number} id Id of the node.
   * @param {string} name Name of the node.
   * @param {string} description Description of the node. 
   * @param {number} posX X coordinate of the node.
   * @param {number} posY Y coordinate of the node.
   * @param {NodeStates} state Shows the state of the node.
   * @param {Label} label Label of the node.
   * @param {Array<Line>} linesIn All lines that come from parent nodes to this node.
   * @param {Array<Line>} linesOut All lines that come from children nodes to this node.
   * @param {Array<Node>} parents All parents nodes of this node. 
   * @param {Array<Node>} childs All children nodes of this node. 
   */
  constructor(
    id: number,
    name: string,
    description: string,
    posX: number,
    posY: number,
    state: NodeStates = NodeStates.Idle,
    label?: Label,
    linesIn?: Array<Line>,
    linesOut?: Array<Line>,
    parents?: Array<NodeWrapper>,
    childs?: Array<NodeWrapper>
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
    if(linesIn){
      this.linesChild = linesOut;
      this.linesParent = linesIn;
      this.parents = parents;
      this.childs = childs;
    }
  }

  /**
   * Initializes all static parameters.
   * @param shadow Shadow of the node.
   * @param stroke Color of the stroke.
   * @param idleStrokeWidth Width of the stroke when node is in idle or hover state.
   * @param activeStrokeWidth Width of the stroke when node is in active state.
   */
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
  
  /**
   * Shows whether the node can be uncompleted or not
   * @returns {boolean} Can the node be uncompleted.
   */
  public CanBeToggled(): boolean {
    for (let i = 0; i < this.childs.length; i++) {
      if (this.childs[i].node.isCompleted === false) {
        continue;
      }
      const child: Node = this.childs[i].node;
      let depends: boolean = true;
      for (let j = 0; j < child.parents.length; j++) {
        const parent: Node = child.parents[j].node;
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

  /**
   * Uncompletes the node.
   * @returns {Node} Uncompleted copy of this node.
   */
  public Toggle(): Node {
    if (!this.CanBeToggled()) {
      return null;
    }
    this.label.SetUncompleted();
    let uncompletedNode = new UncompletedNode(
      this.id,
      this.nodeName,
      this.description,
      this.left,
      this.top,
      this.state,
      this.label,
      this.linesParent,
      this.linesChild,
      this.parents,
      this.childs
    );
    return uncompletedNode;
  }

  /**
   * Sets node's visuals to Idle.
   */
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

  /**
   * Sets node's visuals to Hover.
   */
  public SetHover(): void {
    this.animate('radius', CompletedNode.activeSize, {
      onChange: CompletedNode.canvas.renderAll.bind(CompletedNode.canvas),
      duration: 50,
    });
    this.state = NodeStates.Hover;
  }

  /**
   * Sets node's visuals to Active.
   */
  public SetActive(): void {
    this.set('strokeWidth', CompletedNode.activeStrokeWidth);
    this.state = NodeStates.Active;
  }
}
