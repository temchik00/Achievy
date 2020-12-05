import { fabric } from 'fabric';
import { LinkInfo } from './graph';
import { Label } from './label';
import { Line } from './line';

export enum NodeStates {
  Idle,
  Hover,
  Active,
}

/**
 * Base class for nodes
 */
export abstract class Node extends fabric.Circle {
  /**
   * Size of a node in it's idle state.
   */
  protected static idleSize: number;
  /**
   * Size of a node in it's active state.
   */
  protected static activeSize: number;
  /**
   * Inside color of the node.
   */
  protected static fill: string | fabric.Pattern | fabric.Gradient;
  /**
   * Canvas on which objects are drawn.
   */
  protected static canvas: fabric.Canvas;

  /**
   * Label of the node.
   */
  public label: Label;
  /**
   * Id of the node. 
   */
  public id: number;
  /**
   * Name of the node.
   */
  public nodeName: string;
  /**
   * Description of the node. 
   */
  public description: string;
  /**
   * Shows whether node is complete or not. 
   */
  public isCompleted: boolean;
  /**
   * Shows the state of the node.
   */
  public state: NodeStates;

  /**
   * Stores all parent nodes of this node.
   */
  public parents: Array<Node>;
  /**
   * Stores all children nodes of this node.
   */
  public childs: Array<Node>;
  /**
   * Stores all lines that come from parent nodes to this node.
   */
  public linesParent: Array<Line>;
  /**
   * Stores all lines that come from children nodes to this node.
   */
  public linesChild: Array<Line>;

  /**
   * Constructor of the node.
   * @param {number} id Id of the node.
   * @param {string} name Name of the node.
   * @param {string} description Description of the node. 
   * @param {number} posX X coordinate of the node.
   * @param {number} posY Y coordinate of the node.
   * @param {boolean} isCompleted Shows whether node is complete or not.
   * @param {NodeStates} state Shows the state of the node.
   * @param {Label} label Label of the node.
   */
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
    this.parents = new Array<Node>();
    this.childs = new Array<Node>();
    this.linesChild = new Array<Line>();
    this.linesParent = new Array<Line>();
    this.id = id;
    this.nodeName = name;
    this.description = description;
    this.isCompleted = isCompleted;
    this.state = state;
    /**
     * Stores label if it is passed, otherwise creates new one.
     */
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

  /**
   * Initializes all static parameters
   * @param {number} idleSize Size of a node in it's idle state.
   * @param {number} activeSize Size of a node in it's active state.
   * @param {string | fabric.Pattern | fabric.Gradient} fill Inside color of the node.
   * @param {fabric.Canvas} canvas Canvas on which objects are drawn.
   */
  public static InitNode(
    idleSize: number,
    activeSize: number,
    fill: string | fabric.Pattern | fabric.Gradient,
    canvas: fabric.Canvas
  ) {
    Node.idleSize = idleSize;
    Node.activeSize = activeSize;
    Node.fill = fill;
    Node.canvas = canvas;
  }

  /**
   * Adds new parent node
   * @param {Node} parentNode New parent node, that will be added.
   */
  public AddParent(parentNode: Node): void {
    if (!this.parents.includes(parentNode)) {
      this.parents.push(parentNode);
    }
    console.log(this.parents);
  }
  
  /**
   * Adds new child node
   * @param {Node} childNode New child node, that will be added.
   */
  public AddChild(childNode: Node): void {
    if (!this.childs.includes(childNode)) {
      this.childs.push(childNode);
    }
  }
  
  /**
   * Adds new line from parent node.
   * @param {Line} parentLine New line, that will be added.
   */
  public AddParentLine(parentLine: Line) {
    if (!this.linesParent.includes(parentLine)) {
      this.linesParent.push(parentLine);
    }
  }

  /**
   * Adds new line from child node.
   * @param {Line} childLine New line, that will be added.
   */
  public AddChildLine(childLine: Line) {
    if (!this.linesChild.includes(childLine)) {
      this.linesChild.push(childLine);
    }
  }

  /**
   * Replaces one parent node with another.
   * @param {Node} oldValue Node that will be replaced.
   * @param {Node} newValue Node that will replace the previous one.
   */
  public replaceParent(oldValue:Node, newValue:Node):void{
    let replaceIndex = this.parents.indexOf(oldValue);
    console.log(this.parents[replaceIndex]);
    this.parents[replaceIndex] = newValue;
    console.log(this.parents[replaceIndex]);
    console.log(replaceIndex);
  }

  
  /**
   * Replaces one child node with another.
   * @param {Node} oldValue Node that will be replaced.
   * @param {Node} newValue Node that will replace the previous one.
   */
  public replaceChild(oldValue:Node, newValue:Node):void{
    let replaceIndex = this.childs.indexOf(oldValue);
    this.childs[replaceIndex] = newValue;
  }

  /**
   * Abstract method to update visuals of all linked lines.
   */
  protected abstract UpdateLines(): void;
  /**
   * Abstract method. It is used to define whether node can be toggled or not.
   */
  public abstract CanBeToggled(): boolean;
  /**
   * Abstract method. It is used to toggle the node.
   */
  public abstract Toggle(): Node;
  /**
   * Abstract method. It is used to set node's state to Idle.
   */
  public abstract SetIdle(): void;
  /**
   * Abstract method. It is used to set node's state to Hover.
   */
  public abstract SetHover(): void;
  /**
   * Abstract method. It is used to set node's state to Active.
   */
  public abstract SetActive(): void;
}
