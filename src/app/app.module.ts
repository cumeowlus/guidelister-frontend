import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app';
import { AuthComponent } from './components/auth/auth.component';
import { HeaderComponent } from './components/header/header.component';
import { MyGuidesComponent } from './components/my-guides/my-guides.component';
import { GuideDetailComponent } from './components/guide-detail/guide-detail.component';

@NgModule({
  declarations: [
    AuthComponent,
    HeaderComponent,
    MyGuidesComponent,
    GuideDetailComponent
  ],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule, FormsModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
