import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AuthInterceptorService } from './auth-interceptor';
import { LoggingInterceptorService } from './logging-interceptor';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule],
  providers: [ 
    //The order in which you provide them matters because that will be the order in which
    //they are executed
    {
      provide: HTTP_INTERCEPTORS, //This is the token by which this injection can later
                //be identified by angular, so it will know that all the classes you provide
                //on that token so by using the identifier, should be treated as HTTP interceptors
                //and should therefore run their intercept method whenever a request leaves the application
      useClass: AuthInterceptorService,
      multi: true //you can have more than one interceptor and you inform Angular about that
                //and that it should not replace the existing interceptors with this one
                //by adding multi and setting this to true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoggingInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
