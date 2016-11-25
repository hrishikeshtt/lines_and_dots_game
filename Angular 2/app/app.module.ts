import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent, LineDrawing}   from './app.component';
@NgModule({
    imports: [BrowserModule],
    declarations: [AppComponent, LineDrawing],
    bootstrap: [AppComponent, LineDrawing]
})
export class AppModule { }
