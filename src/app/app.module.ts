import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { AppComponent } from './app.component';
import { UsMapComponent } from './us-map/us-map.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {BASE_PATH, StatesService} from "./core/services/swagger-gen/service";
import {environment} from "../enviroment/enviroment";


@NgModule({
  declarations: [
    AppComponent,
    UsMapComponent,
  ],
  imports: [
    BrowserModule,
    MatSelectModule,
    BrowserAnimationsModule,
    MatInputModule,
    HttpClientModule,
  ],
  providers: [
    StatesService,{
      provide: BASE_PATH,
      useValue: environment.testURI,
    },],
  bootstrap: [AppComponent]
})
export class AppModule { }
