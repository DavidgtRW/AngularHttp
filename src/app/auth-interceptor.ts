import { HttpEvent, HttpEventType, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";


//To provide this service is neccesary implement a special way
//check the app module
export class AuthInterceptorService implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler) {

        const modifiedRequest = req.clone(
            {
                headers: req.headers.append('Auth', 'xyz')
            }
        );
        //next is an object with an important method that will allow us
        //to let the request continue its journey
        //So that is the setup ypu need to use to have some code that is
        //run right before the request leaves the app and to still let
        //the request leave the app
        return next.handle(modifiedRequest)  //calling this, you let the request continue
            .pipe(
                tap(
                    event => {
                        console.log(event);
                        if(event.type === HttpEventType.Response) {
                            console.log('Response arrived, body data: ');
                            console.log(event.body);   
                        }
                    }
                )
            );
        //and you should actually return the result to really let it continue
        //If I don't return next handle and pass the request, then the request
        //will not continue and therefore the app will basically break

    }

}