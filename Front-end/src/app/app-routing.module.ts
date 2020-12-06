import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthorizationComponent } from './components/authorization/authorization.component';
import { GraphViewerComponent } from './components/graph-viewer/graph-viewer.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { GraphBrowserComponent } from './components/graph-browser/graph-browser.component';
import { PersonalAccountComponent } from './components/personal-account/personal-account.component';

const routes: Routes = [
  {path: '', component: AuthorizationComponent},
  {path: 'browser/graph', component: GraphViewerComponent},
  {path: 'registration', component: RegistrationComponent},
  {path: 'browser', component: GraphBrowserComponent},
  {path: 'account', component: PersonalAccountComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
