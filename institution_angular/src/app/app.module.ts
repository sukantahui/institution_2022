import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSidenavModule } from '@angular/material/sidenav';
// import { MatToolbarModule } from '@angular/material/toolbar';
// import { MatMenuModule } from '@angular/material/menu';
// import { MatIconModule} from '@angular/material/icon';
// import { MatDividerModule } from '@angular/material/divider';
// import { MatListModule } from '@angular/material/list';
// import { MatCardModule } from '@angular/material/card';
// import { MatTabsModule } from '@angular/material/tabs';
// import { NgChartsModule } from 'ng2-charts';
// import { MatInputModule } from '@angular/material/input';
// import { MatButtonModule } from '@angular/material/button';

// import { ReactiveFormsModule } from '@angular/forms';
// import { SidenavComponent } from './sidenav/sidenav.component';
import {SidenavModule} from "./sidenav/sidenav.module";
import {HeaderModule} from "./header/header.module";

@NgModule({
  declarations: [
    AppComponent,
    // SidenavComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    // MatToolbarModule,
    // MatMenuModule,
    // MatIconModule,
    // MatDividerModule,
    // MatListModule,
    // MatCardModule,
    // MatTabsModule,
    // NgChartsModule,
    // MatInputModule,
    // MatButtonModule,
    // ReactiveFormsModule,
    SidenavModule,
    HeaderModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
