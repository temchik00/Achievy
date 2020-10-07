import { UncompletedNode } from "./uncompletedNode";
import { CompletedNode } from "./completedNode";
import { Node } from "./node";
import { Line } from "./line"

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
    public nodes: Array<Node>;
    constructor(graphInfo: GraphInfo, activeNodeIds: Set<number>){
        graphInfo.nodes.forEach(nodeInfo => {
            if (activeNodeIds.has(nodeInfo.id)){
                this.nodes.push(new CompletedNode(nodeInfo.id, nodeInfo.label, nodeInfo.description, nodeInfo.x, nodeInfo.y));
            }
            else{
                this.nodes.push(new UncompletedNode(nodeInfo.id, nodeInfo.label, nodeInfo.description, nodeInfo.x, nodeInfo.y));
            }
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
        });
    }
}
