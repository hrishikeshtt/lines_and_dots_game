import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { AppComponent, LineDrawing, NgbdModalBasic }   from './app.component';
@NgModule({
    imports: [BrowserModule, NgbModule.forRoot()],
    declarations: [AppComponent, LineDrawing, NgbdModalBasic],
    bootstrap: [AppComponent, LineDrawing, NgbdModalBasic]
})
export class AppModule { }
