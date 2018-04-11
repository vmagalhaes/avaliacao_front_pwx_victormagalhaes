import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';

import { PersonComponent } from './person';

// Bootstrap

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// Material Modules
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule, MatCheckboxModule, MatToolbarModule, MatIconModule } from '@angular/material'
import 'hammerjs';

@NgModule({
  declarations: [
    AppComponent,
    PersonComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    CoreModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MatMenuModule,
    MatToolbarModule,
    NgbModule.forRoot()
  ],
  exports: [
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MatMenuModule,
    MatToolbarModule
  ],
  providers: [],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
