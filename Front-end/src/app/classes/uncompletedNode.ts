import { Shadow } from 'fabric/fabric-impl';
import { Node, NodeStates } from './node';
import { CompletedNode } from './completedNode';
import { Line } from './line';
import { Label } from './label';

/**
 * Class that represents uncompleted node.
 */
export class UncompletedNode extends Node {
  /**
   * Shadow of the active node.
   */
  private static activeShadow: string | Shadow;
  /**
   * Shadow of the idle node.
   */
  private static idleShadow: string | Shadow;
  /**
   * Color of the stroke when node is active.
   */
  private static activeStroke: string;
  /**
   * Color of the stroke when node is idle.
   */
  private static idleStroke: string;
  /**
   * Width of the stroke when node is active.
   */
  private static activeStrokeWidth: number;
  /**
   * Width of the stroke when node is hover.
   */
  private static hoverStrokeWidth: number;
  /**
   * Width of the stroke when node is idle.
   */
  private static idleStrokeWidth: number;

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
    parents?: Array<Node>,
    childs?: Array<Node>
  ) {
    super(id, name, description, posX, posY, false, state, label);
    if (state === NodeStates.Idle) {
      this.setShadow(UncompletedNode.idleShadow);
      this.set('stroke', UncompletedNode.idleStroke);
      this.set('strokeWidth', UncompletedNode.idleStrokeWidth);
    } else {
      this.setShadow(UncompletedNode.activeShadow);
      this.set('stroke', UncompletedNode.activeStroke);
      this.set('strokeWidth', UncompletedNode.activeStrokeWidth);
    }
    if(linesIn){
      this.linesChild = linesOut;
      this.linesParent = linesIn;
      this.parents = parents;
      this.childs = childs;
    }
  }

  /**
   * Initializes all static parameters.
   * @param {string | Shadow} activeShadow Shadow of the active node.
   * @param {string | Shadow} idleShadow Shadow of the idle node.
   * @param {string} activeStroke Color of the stroke when node is active.
   * @param {string} idleStroke Color of the stroke when node is idle.
   * @param {number} activeStrokeWidth Width of the stroke when node is active.
   * @param {number} hoverStrokeWidth Width of the stroke when node is hover.
   * @param {number} idleStrokeWidth Width of the stroke when node is idle.
   */
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

  /**
   * Updates visuals of all lines.
   */
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

  /**
   * Shows whether the node can be completed or not
   * @returns {boolean} Can the node be completed.
   */
  public CanBeToggled(): boolean {
    if(this.parents.length === 0)
      return true;
    /**
     * If there is at least one parent node that is completed, it can be completed.
     */
    for (let index = 0; index < this.parents.length; index++) {
      if(this.parents[index].isCompleted === true){
        return true;
      }
    }
    return false;
  }
  
  /**
   * Completes the node.
   * @returns {Node} Completed copy of this node.
   */
  public Toggle(): Node {
    if (!this.CanBeToggled()) {
      return null;
    }
    /**
     * Updates visuals of lines.
     */
    this.UpdateLines();
    /**
     * Updates visuals of label.
     */
    this.label.SetCompleted();
    /**
     * Creates completed copy of this node.
     */
    let completedNode = new CompletedNode(
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
    /**
     * Updates all references to this node so they lead to new one.
     */
    for (let i = 0; i < this.linesChild.length; i++) {
      this.linesChild[i].source = completedNode;
    }
    for (let i = 0; i < this.linesParent.length; i++) {
      this.linesParent[i].target = completedNode;
    }
    for (let index = 0; index < this.parents.length; index++) {
      this.parents[index].replaceChild(this, completedNode)
    }
    for (let index = 0; index < this.childs.length; index++) {
      this.childs[index].replaceParent(this, completedNode)
    }
    return completedNode;
  }

  /**
   * Sets node's visuals to Idle.
   */
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

  /**
   * Sets node's visuals to Hover.
   */
  public SetHover(): void {
    this.set('strokeWidth', UncompletedNode.hoverStrokeWidth);
    this.set('stroke', UncompletedNode.activeStroke);
    this.animate('radius', UncompletedNode.activeSize, {
      onChange: UncompletedNode.canvas.renderAll.bind(UncompletedNode.canvas),
      duration: 50,
    });
    this.state = NodeStates.Hover;
  }

  /**
   * Sets node's visuals to Active.
   */
  public SetActive(): void {
    this.set('strokeWidth', UncompletedNode.activeStrokeWidth);
    this.set('shadow', UncompletedNode.activeShadow);
    this.state = NodeStates.Active;
  }
}
