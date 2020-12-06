import { NodeStates } from "./node";
import { Line } from "./line";
import { fabric } from "fabric";
import { NodeWrapper } from './node-wrapper';

/**
 * Interface that represents information about node.
 */
export interface NodeInfo{
    "id": number,
    "x": number,
    "y": number,
    "label": string,
    "description": string,
    "isCompleted": boolean
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
    private nodes: Array<NodeWrapper>;
    /**
     * Node that is currently selected.
     */
    public activeNode: NodeWrapper;
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
    constructor(graphInfo: GraphInfo, canvas: fabric.Canvas){
        this.nodes = new Array<NodeWrapper>();
        this.canvas = canvas;
        this.activeNode = null;
        /**
         * Creating all nodes.
         */
        graphInfo.nodes.forEach(nodeInfo => {
            let node: NodeWrapper = new NodeWrapper(nodeInfo.id, nodeInfo.label, nodeInfo.description, nodeInfo.x, nodeInfo.y, nodeInfo.isCompleted);

            let mouseClick = (event) => {
                if(this.activeNode != null && this.activeNode != node){
                    this.activeNode.node.SetIdle();
                }
                node.node.SetActive();
                this.activeNode = node;
            }
            mouseClick = mouseClick.bind(this, node);
            node.node.on("mouseup", mouseClick);

            let mouseHover = (event) =>{
                if(node.node.state == NodeStates.Idle){
                    node.node.SetHover();
                }
            }
            mouseHover = mouseHover.bind(this, node);
            node.node.on("mouseover", mouseHover);

            let mouseLeave = (event) =>{
                if(node.node.state == NodeStates.Hover){
                    node.node.SetIdle();
                }
            }
            mouseLeave = mouseLeave.bind(this, node);
            node.node.on("mouseout", mouseLeave);

            this.nodes.push(node);
            this.canvas.add(node.node);
            this.canvas.add(node.node.label);
        });

        /**
         * Creating all lines.
         */
        graphInfo.links.forEach(linkInfo => {
            let sourceId: number = this.nodes.findIndex( (node: NodeWrapper) =>{
                return node.node.id === linkInfo.sourceId;
            });
            let targetId: number = this.nodes.findIndex( (node: NodeWrapper) =>{
                return node.node.id === linkInfo.targetId;
            });
            let line: Line = new Line(this.nodes[sourceId], this.nodes[targetId]);
            this.nodes[sourceId].node.AddChild(this.nodes[targetId]);
            this.nodes[sourceId].node.AddChildLine(line);
            this.nodes[targetId].node.AddParent(this.nodes[sourceId]);
            this.nodes[targetId].node.AddParentLine(line);
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
        if(this.activeNode.node.CanBeToggled()){
            this.activeNode.Toggle(this.canvas);
            let node = this.activeNode;

            let mouseClick = (event) => {
                if(this.activeNode != null && this.activeNode != node){
                    this.activeNode.node.SetIdle();
                }
                node.node.SetActive();
                this.activeNode = node;
            }
            mouseClick = mouseClick.bind(this, node);
            this.activeNode.node.on("mouseup", mouseClick);

            let mouseHover = (event) =>{
                if(node.node.state == NodeStates.Idle){
                    node.node.SetHover();
                }
            }
            mouseHover = mouseHover.bind(this, node);
            this.activeNode.node.on("mouseover", mouseHover);

            let mouseLeave = (event) =>{
                if(node.node.state == NodeStates.Hover){
                    node.node.SetIdle();
                }
            }
            mouseLeave = mouseLeave.bind(this, node);
            this.activeNode.node.on("mouseout", mouseLeave);
            this.canvas.requestRenderAll();
        }else{
            return false
        }
    }
}
