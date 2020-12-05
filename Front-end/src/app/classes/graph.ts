import { UncompletedNode } from "./uncompletedNode";
import { CompletedNode } from "./completedNode";
import { Node, NodeStates } from "./node";
import { Line } from "./line";
import { fabric } from "fabric";

/**
 * Interface that represents information about node.
 */
export interface NodeInfo{
    "id": number,
    "x": number,
    "y": number,
    "label": string,
    "description": string
}

/**
 * Interface that represents information about link.
 */
export interface LinkInfo{
    "sourceId": number,
    "targetId": number
}

/**
 * Interface that represents information about whole graph.
 */
export interface GraphInfo{
    "nodes": NodeInfo[],
    "links": LinkInfo[]
}

/**
 * Class that represents graph.
 */
export class Graph {
    /**
     * Array that contains all nodes.
     */
    private nodes: Array<Node>;
    /**
     * Node that is currently selected.
     */
    public activeNode: Node;
    /**
     * Canvas on which objects are drawn.
     */
    private canvas: fabric.Canvas;
    /**
     * Shows if canvas is panning.
     */
    private isPanning: boolean;
    /**
     * Last X position of the cursor when panning.
     */
    private lastPosX: number;
    /**
     * Last Y position of the cursor when panning.
     */
    private lastPosY: number;
    
    /**
     * Constructor of the graph
     * @param {GraphInfo} graphInfo All info about graph.
     * @param {Set<number>} completedNodeIds All completed nodes' ids
     * @param {fabric.Canvas} canvas Canvas on which objects are drawn.
     */
    constructor(graphInfo: GraphInfo, completedNodeIds: Set<number>, canvas: fabric.Canvas){
        this.nodes = new Array<Node>();
        this.canvas = canvas;
        this.activeNode = null;
        /**
         * Creating all nodes.
         */
        graphInfo.nodes.forEach(nodeInfo => {
            let node: Node;
            if (completedNodeIds.has(nodeInfo.id)){
                node = new CompletedNode(nodeInfo.id, nodeInfo.label, nodeInfo.description, nodeInfo.x, nodeInfo.y);
            }
            else{
                node = new UncompletedNode(nodeInfo.id, nodeInfo.label, nodeInfo.description, nodeInfo.x, nodeInfo.y);
            }

            /**
             * Sets node behavior on mouse click.
             * @param event 
             */
            let mouseClick = (event) => {
                if(this.activeNode != null && this.activeNode != node){
                    this.activeNode.SetIdle();
                }
                node.SetActive();
                this.activeNode = node;
            }
            mouseClick = mouseClick.bind(this, node);
            node.on("mouseup", mouseClick);

            /**
             * Sets node behavior on mouse hover.
             * @param event 
             */
            let mouseHover = (event) =>{
                if(node.state == NodeStates.Idle){
                    node.SetHover();
                }
            }
            mouseHover.bind(this, node);

            /**
             * Sets node behavior on mouse leaving it.
             * @param event 
             */
            let mouseUnHover = (event) =>{
                if(node.state == NodeStates.Hover){
                    node.SetIdle();
                }
            }
            mouseUnHover.bind(this, node);
            node.on("mouseover", mouseHover);
            node.on("mouseout", mouseUnHover);

            this.nodes.push(node);
            this.canvas.add(node);
            this.canvas.add(node.label);
        });

        /**
         * Creating all lines.
         */
        graphInfo.links.forEach(linkInfo => {
            let sourceId: number = this.nodes.findIndex( (node: Node, index: number, arr: Node[]) =>{
                return node.id === linkInfo.sourceId;
            });
            let targetId: number = this.nodes.findIndex( (node: Node, index: number, arr: Node[]) =>{
                return node.id === linkInfo.targetId;
            });
            let line: Line = new Line(this.nodes[sourceId], this.nodes[targetId]);
            this.nodes[sourceId].AddChild(this.nodes[targetId]);
            this.nodes[sourceId].AddChildLine(line);
            this.nodes[targetId].AddParent(this.nodes[sourceId]);
            this.nodes[targetId].AddParentLine(line);
            this.canvas.add(line);
            line.sendToBack();
        });

        /**
         * Sets canvas's resizing.
         */
        let resize = () => {
            let viewportWidth = window.innerWidth;
            let viewportHeight = window.innerHeight;
            canvas.setWidth(viewportWidth);
            canvas.setHeight(viewportHeight);
            canvas.calcOffset();
        };
        resize = resize.bind(this);
        this.canvas.on("before:render", resize);

        /**
         * Sets canvas's behavior on mouse scroll.
         * @param opt 
         */
        let zoom = (opt) => {
            let delta = opt.e.deltaY;
            let zoom = this.canvas.getZoom();
            zoom = zoom - delta / 1000;
            if (zoom > 1.5) zoom = 1.5;
            if (zoom < 0.3) zoom = 0.3;
            this.canvas.zoomToPoint(new fabric.Point(opt.e.offsetX, opt.e.offsetY), zoom);
            opt.e.preventDefault();
            opt.e.stopPropagation();
        };
        zoom = zoom.bind(this);
        this.canvas.on("mouse:wheel", zoom);
        
        /**
         * Sets canvas's behavior on mouse down.
         * @param opt 
         */
        let startPanning = (opt) => {
            let evt = opt.e;
            if (opt.target == null) {
                this.isPanning = true;
                this.lastPosX = evt.clientX;
                this.lastPosY = evt.clientY;
            }
        };
        startPanning.bind(this);

        /**
         * Sets canvas's behavior when panning.
         * @param opt 
         */
        let pan = (opt) => {
            if (this.isPanning) {
                let evt = opt.e;
                this.canvas.viewportTransform[4] += evt.clientX - this.lastPosX;
                this.canvas.viewportTransform[5] += evt.clientY - this.lastPosY;
                this.lastPosX = evt.clientX;
                this.lastPosY = evt.clientY;
                this.canvas.forEachObject((obj) => {
                  obj.setCoords();
                });
                this.canvas.requestRenderAll();
            }
        };
        pan = pan.bind(this);

        /**
         * Sets canvas's behavior on mouse up.
         * @param opt 
         */
        let stopPanning = (opt) => {
            this.isPanning = false;
        }
        stopPanning = stopPanning.bind(this);
        this.canvas.on("mouse:down", startPanning);
        this.canvas.on("mouse:up", stopPanning);
        this.canvas.on("mouse:move", pan);

        
        this.canvas.renderAll();
    }

    /**
     * Tries to toggle selected node.
     * @returns {boolean} Whether it was successfull.
     */
    public toggleActiveNode(): boolean{
        if(this.activeNode.CanBeToggled()){
            let newNode:Node = this.activeNode.Toggle();
            
            /**
             * Sets node behavior on mouse click.
             * @param event 
             */
            let mouseClick = (event) => {
                if(this.activeNode != null && this.activeNode != newNode){
                    this.activeNode.SetIdle();
                }
                newNode.SetActive();
                this.activeNode = newNode;
            }
            mouseClick = mouseClick.bind(this, newNode);
            newNode.on("mouseup", mouseClick);

            /**
             * Sets node behavior on mouse hover.
             * @param event 
             */
            let mouseHover = (event) =>{
                if(newNode.state == NodeStates.Idle){
                    newNode.SetHover();
                }
            }
            mouseHover.bind(this, newNode);
            
            /**
             * Sets node behavior on mouse leaving it.
             * @param event 
             */
            let mouseUnHover = (event) =>{
                if(newNode.state == NodeStates.Hover){
                    newNode.SetIdle();
                }
            }
            mouseUnHover.bind(this, newNode);
            newNode.on("mouseover", mouseHover);
            newNode.on("mouseout", mouseUnHover);

            /**
             * Stops rendering old node.
             */
            this.canvas.remove(this.activeNode);
            this.canvas.remove(this.activeNode.label);
            /**
             * Starts rendering new node.
             */
            this.canvas.add(newNode);
            this.canvas.add(newNode.label);
            this.nodes.splice(this.nodes.indexOf(this.activeNode), 1);
            delete this.activeNode;
            this.nodes.push(newNode);
            this.activeNode = newNode;
            this.canvas.requestRenderAll();
        }else{
            return false
        }
    }
}
