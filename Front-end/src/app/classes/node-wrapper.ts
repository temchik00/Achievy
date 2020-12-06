import { Node, NodeStates } from "./node";
import { UncompletedNode } from "./uncompletedNode";
import { CompletedNode } from "./completedNode";

export class NodeWrapper {
    public node: Node;

    constructor(
        id: number,
        name: string,
        description: string,
        posX: number,
        posY: number,
        isCompleted: boolean,
        state: NodeStates = NodeStates.Idle
        ){
        if(isCompleted === true){
            this.node = new CompletedNode(id, name, description, posX, posY, state);
        }else{
            this.node = new UncompletedNode(id, name, description, posX, posY, state);
        }
    }

    public Toggle(canvas: fabric.Canvas):void {
        if(this.node.CanBeToggled()){
            canvas.remove(this.node);
            canvas.remove(this.node.label);
            this.node = this.node.Toggle();
            canvas.add(this.node);
            canvas.add(this.node.label);
            this.node.UpdateLines();
        }
    }
}
