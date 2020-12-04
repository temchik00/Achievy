import { UncompletedNode } from "./uncompletedNode";
import { CompletedNode } from "./completedNode";
import { Node, NodeStates } from "./node";
import { Line } from "./line";
import { fabric } from "fabric";

export interface NodeInfo{
    "id": number,
    "x": number,
    "y": number,
    "label": string,
    "description": string
}

export interface LinkInfo{
    "sourceId": number,
    "targetId": number
}

export interface GraphInfo{
    "nodes": NodeInfo[],
    "links": LinkInfo[]
}

export class Graph {
    private nodes: Array<Node>;
    public activeNode: Node;
    private canvas: fabric.Canvas;
    private isPanning: boolean;
    private lastPosX: number;
    private lastPosY: number;
    constructor(graphInfo: GraphInfo, activeNodeIds: Set<number>, canvas: fabric.Canvas){
        this.nodes = new Array<Node>();
        this.canvas = canvas;
        this.activeNode = null;
        graphInfo.nodes.forEach(nodeInfo => {
            let node: Node;
            if (activeNodeIds.has(nodeInfo.id)){
                node = new CompletedNode(nodeInfo.id, nodeInfo.label, nodeInfo.description, nodeInfo.x, nodeInfo.y);
            }
            else{
                node = new UncompletedNode(nodeInfo.id, nodeInfo.label, nodeInfo.description, nodeInfo.x, nodeInfo.y);
            }

            let mouseClick = (event) => {
                if(this.activeNode != null && this.activeNode != node){
                    this.activeNode.SetIdle();
                }
                node.SetActive();
                this.activeNode = node;
            }
            mouseClick = mouseClick.bind(this, node);
            node.on("mouseup", mouseClick);

            let mouseHover = (event) =>{
                if(node.state == NodeStates.Idle){
                    node.SetHover();
                }
            }
            mouseHover.bind(this, node);

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
        graphInfo.links.forEach(linkInfo => {
            let source: Node = this.nodes.find( (node: Node, index: number, arr: Node[]) =>{
                return node.id === linkInfo.sourceId;
            });
            let target: Node = this.nodes.find( (node: Node, index: number, arr: Node[]) =>{
                return node.id === linkInfo.targetId;
            });
            let line: Line = new Line(source, target);
            source.AddChild(target);
            source.AddChildLine(line);
            target.AddParent(source);
            target.AddParentLine(line);
            this.canvas.add(line);
            line.sendToBack();
        });
        let resize = () => {
            let viewportWidth = window.innerWidth;
            let viewportHeight = window.innerHeight;
            canvas.setWidth(viewportWidth);
            canvas.setHeight(viewportHeight);
            canvas.calcOffset();
        };
        resize = resize.bind(this);
        this.canvas.on("before:render", resize);

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
        
        let startPanning = (opt) => {
            let evt = opt.e;
            if (opt.target == null) {
                this.isPanning = true;
                this.lastPosX = evt.clientX;
                this.lastPosY = evt.clientY;
            }
        };
        startPanning.bind(this);

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

        let stopPanning = (opt) => {
            this.isPanning = false;
        }
        stopPanning = stopPanning.bind(this);
        this.canvas.on("mouse:down", startPanning);
        this.canvas.on("mouse:up", stopPanning);
        this.canvas.on("mouse:move", pan);

        
        this.canvas.renderAll();
    }
}
