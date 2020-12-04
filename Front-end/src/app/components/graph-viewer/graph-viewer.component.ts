import { Component, OnInit } from '@angular/core';
import { Graph, GraphInfo, LinkInfo, NodeInfo } from "../../classes/graph";
import { Node } from "../../classes/node";
import { UncompletedNode } from "../../classes/uncompletedNode";
import { CompletedNode } from "../../classes/completedNode";
import { Label } from "../../classes/label";
import { fabric } from "fabric";
import { Line } from "../../classes/line";
@Component({
  selector: 'app-graph-viewer',
  templateUrl: './graph-viewer.component.html',
  styleUrls: ['./graph-viewer.component.scss']
})
export class GraphViewerComponent implements OnInit {
  private graph:Graph;
  private canvas:fabric.Canvas;
  constructor() {
   }

  ngOnInit(): void {
    this.canvas = new fabric.Canvas("canvas", {
      selection: false,
      backgroundColor: "rgb(40,40,40)",
    });
    Node.InitNode(30, 39, "rgb(30, 30, 30)", this.canvas);
    UncompletedNode.Init(
      new fabric.Shadow({
        color: "rgba(255, 100, 255, 1)",
        blur: 18,
      }),
      new fabric.Shadow({
        color: "rgba(15, 15, 15, 0.9)",
        blur: 10,
      }),
      "rgba(245, 90, 245, 1)",
      "rgba(245, 90, 245, 1)",
      0.975,
      0.975,
      3
    );
    CompletedNode.Init(
      new fabric.Shadow({
        color: "rgba(57, 255, 20, 1)",
        blur: 18,
      }),
      "rgba(57, 255, 20, 1)",
      3,
      0.975
    )
    Line.Init(
      new fabric.Shadow({
        color: "rgba(255, 100, 255, 0.7)",
        blur: 12,
      }),
      new fabric.Shadow({
        color: "rgba(255, 211, 25, 0.7)",
        blur: 12,
      }),
      new fabric.Shadow({
        color: "rgba(57, 255, 20, 0.65)",
        blur: 12,
      }),
      "rgb(255, 255, 255)",
      2
    );
    Label.Init(
      "rgba(255, 100, 255, 0.9) 2px 2px 2px",
      "rgba(57, 255, 20, 0.9) 2px 2px 2px"
    )
    

    let nodeInfo:NodeInfo = {id:1, x:100, y:100, label:"asd", description:"asd"};
    let nodeInfo2:NodeInfo = {id:2, x:200, y:200, label:"asd", description:"asd"};
    let nodeInfo3:NodeInfo = {id:3, x:100, y:200, label:"asd", description:"asd"};
    let link1:LinkInfo = {sourceId: 1, targetId: 2};
    let link2:LinkInfo = {sourceId: 2, targetId: 3};
    let graphInfo:GraphInfo = {nodes: [nodeInfo, nodeInfo2, nodeInfo3], links: [link1, link2]};
    let active:Set<number> = new Set<number>();
    active.add(3);
    this.graph = new Graph(graphInfo, active, this.canvas);
  }

}
