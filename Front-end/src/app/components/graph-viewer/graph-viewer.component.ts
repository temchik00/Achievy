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
  /**
   * Contains all objects that are being drawn.
   */
  public graph:Graph;
  public menuPanelPos:string;
  public menuExtended:boolean;
  /**
   * Canvas on which objects are drawn.
   */
  private canvas:fabric.Canvas;
  constructor() {
    this.menuPanelPos = (window.innerWidth).toString() + "px";
    this.menuExtended = false;
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
  }

  ngOnInit(): void {
    this.canvas = new fabric.Canvas("canvas", {
      selection: false,
      backgroundColor: "rgb(40,40,40)",
    });
    Node.InitNode(30, 39, "rgb(30, 30, 30)", this.canvas);
    
    

    let nodeInfo:NodeInfo = {id:1, x:100, y:100, label:"Asd", description:"Lorem ipsum, dolor sit amet consectetur adipisicing elit. Placeat, repellat possimus expedita veritatis, nulla est amet dolores sint ipsa id doloribus non in aliquid beatae commodi at dolorum. Et recusandae harum eos voluptas optio voluptate veritatis deserunt quidem, obcaecati suscipit veniam neque saepe blanditiis numquam perferendis! Porro nobis assumenda ab! Placeat tempore ut labore quidem sapiente consectetur quam, unde blanditiis rem officia odio quod illo nemo illum libero nesciunt distinctio molestias repudiandae veritatis iusto cum ad consequuntur, magnam laborum. Suscipit quae optio accusamus magni ipsum ad modi! Culpa repellendus voluptatibus blanditiis exercitationem ab! Minus dicta perspiciatis optio debitis adipisci, porro accusantium voluptas quod rem non, nisi molestiae maxime at numquam similique velit. Assumenda fuga cum tenetur est officiis dicta quam sed, consequatur eligendi voluptatem molestiae deleniti libero. Id commodi, quas minus nostrum ea obcaecati tempore assumenda ratione veniam recusandae tenetur, possimus molestias nobis vel hic unde consectetur itaque eum quidem dicta autem. Repellat, itaque aliquid. Quidem et sequi nihil earum autem, quisquam numquam repellendus ratione id ab adipisci, inventore, sed illo temporibus quibusdam atque illum nisi voluptatem quasi fuga voluptatum! Quae qui ex veritatis consequuntur esse ab, ducimus in aperiam est ut similique perferendis quo rerum saepe, architecto illo quasi error ipsam excepturi magnam dolorem eos. Ducimus quaerat iure accusantium delectus fugit maiores. Non, inventore rem ex iusto repellat sapiente, quasi nostrum tenetur harum aut ut amet enim praesentium nulla, porro obcaecati error perferendis natus eius veritatis asperiores. Modi, numquam reprehenderit. Doloremque earum ad quis debitis placeat assumenda sint totam impedit rem officia laboriosam iure quod corporis esse molestias amet incidunt recusandae accusamus quibusdam, odit ipsam unde tenetur saepe cupiditate. Et quas dolores veritatis, laudantium voluptatem molestiae totam quasi in magnam sequi labore quis assumenda quod soluta omnis obcaecati est aut. Aut accusantium aperiam dolorem vero, autem maiores dignissimos illum delectus. Debitis placeat, ut voluptate doloremque fugiat totam eligendi autem molestias vel ex expedita sapiente dolorum magnam fuga aliquid nesciunt sequi accusamus et! Porro, officia nihil. Nemo nisi modi consequatur vero obcaecati! Illum quod quaerat mollitia placeat? Fugiat eum, sint similique quae, ipsa ullam corporis, nostrum quos omnis molestias quas. Delectus eaque hic quidem amet. Sed nisi saepe ullam eveniet ducimus, soluta molestias deserunt veniam quo. Est facere voluptatum dicta molestias, quisquam odio quo aliquam. Quisquam possimus inventore reprehenderit quos a iure voluptatum, repellat labore commodi aliquid tempore sunt aperiam vero ipsam dignissimos maxime fugiat cupiditate repudiandae! Qui error veniam nemo porro repellendus, molestiae aliquid tenetur laborum illo? Ut perspiciatis tempore necessitatibus excepturi fuga praesentium assumenda veritatis rerum cumque. Aliquam odio architecto rerum, harum, vel magni cum voluptate, temporibus ut minima reiciendis ipsa repellat doloribus autem ipsum laborum accusamus ex! Voluptatum ullam fugit autem nostrum soluta repudiandae error, corrupti quia voluptates, enim delectus. Quisquam fuga corrupti id impedit maiores, perspiciatis quos ratione facilis enim facere obcaecati a quasi soluta architecto quia deleniti quas nobis? Quod suscipit ad illo. Consequatur incidunt cumque odit possimus, recusandae aliquam laboriosam voluptate nihil sint quisquam esse, ex facere, odio voluptatibus facilis obcaecati modi. Iste, minus.", isCompleted: false};
    let nodeInfo2:NodeInfo = {id:2, x:200, y:200, label:"Asd", description:"asdasdasd", isCompleted: false};
    let nodeInfo3:NodeInfo = {id:3, x:100, y:200, label:"Asd", description:"asdasdasd", isCompleted: false};
    let link1:LinkInfo = {sourceId: 1, targetId: 2};
    let link2:LinkInfo = {sourceId: 2, targetId: 3};
    let graphInfo:GraphInfo = {nodes: [nodeInfo, nodeInfo2, nodeInfo3], links: [link1, link2]};
    this.graph = new Graph(graphInfo, this.canvas);
  }

  /**
   * Method that fires when sidepanel is closing.
   */
  public closeSidePanel(){
    this.graph.activeNode.node.SetIdle();
    this.graph.activeNode = null;
  }
  
  /**
   * Selector of classes for done/undone button.
   */
  public buttonClassSelector(){
    let classes = {
      doneButton:this.graph.activeNode.node.isCompleted === false,
      undoneButton:this.graph.activeNode.node.isCompleted === true,
    };
    return classes;
  }

  /**
   * Toggles selected node.
   */
  public toggleSelectedNode(){
    let result = this.graph.toggleActiveNode();
    if(result === false){
      alert("Вы не можете совершить данное действие.");
    }
  }

  public toggleMenuPanel(){
    if(this.menuExtended === true){
      this.menuPanelPos = (window.innerWidth).toString() + "px";
      this.menuExtended = false;
    }else{
      this.menuPanelPos = (window.innerWidth-220).toString() + "px";
      this.menuExtended = true;
    }

  }

}
