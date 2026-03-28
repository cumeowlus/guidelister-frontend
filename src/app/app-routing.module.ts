import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './components/auth/auth.component';
import { MyGuidesComponent } from './components/my-guides/my-guides.component';
import { GuideDetailComponent } from './components/guide-detail/guide-detail.component';

export const routes: Routes = [
  { path: 'login', component: AuthComponent },
  { path: 'my-guides', component: MyGuidesComponent },
  { path: 'my-guides/:id', component: GuideDetailComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
