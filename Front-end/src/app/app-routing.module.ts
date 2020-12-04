import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GraphViewerComponent } from './components/graph-viewer/graph-viewer.component';

const routes: Routes = [
  {path: '', component: GraphViewerComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
