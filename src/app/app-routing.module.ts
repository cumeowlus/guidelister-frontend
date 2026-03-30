import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './components/auth/auth.component';
import { MyGuidesComponent } from './components/my-guides/my-guides.component';
import { GuideDetailComponent } from './components/guide-detail/guide-detail.component';
import { AdminHomeComponent } from './components/admin-home/admin-home.component';
import { AdminGuidesListComponent } from './components/admin-guides-list/admin-guides-list.component';
import { AdminGuideFormComponent } from './components/admin-guide-form/admin-guide-form.component';
import { AdminGuideDetailComponent } from './components/admin-guide-detail/admin-guide-detail.component';
import { AdminUsersListComponent } from './components/admin-users-list/admin-users-list.component';
import { AdminUserFormComponent } from './components/admin-user-form/admin-user-form.component';

export const routes: Routes = [
  { path: 'login', component: AuthComponent },
  { path: 'my-guides', component: MyGuidesComponent },
  { path: 'my-guides/:id', component: GuideDetailComponent },
  { path: 'admin', component: AdminHomeComponent },
  { path: 'admin/guides', component: AdminGuidesListComponent },
  { path: 'admin/guides/new', component: AdminGuideFormComponent },
  { path: 'admin/guides/:id', component: AdminGuideDetailComponent },
  { path: 'admin/guides/:id/edit', component: AdminGuideFormComponent },
  { path: 'admin/users', component: AdminUsersListComponent },
  { path: 'admin/users/new', component: AdminUserFormComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
