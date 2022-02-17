import { HttpClient, HttpEventType, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Subscription, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Post } from './post.model';

@Injectable({
  providedIn: 'root'
})
//Two approaches to instance service, here with the Injectable annotation
//or in the app.module on the providers array
export class PostService {

  errorSubject = new Subject<string>(); //Subject is especially useful if you have
  //multiple places in the application that might be interested in your error
  //Remaining step is taht we subscribe to that subject in all the places
  //we're interested in that error message

  updateSubject = new Subject<boolean>();

  constructor(private http: HttpClient) { }

  // createAndStorePost(title: string, content: string){
  //   const postData: Post = {title: title, content: content};
  //   // Send Http request
  //   console.log(postData);
  //   return this.http
  //     .post<{ name: string }> //optional but recommended
  //     (
  //       'https://angular-course-20f3b-default-rtdb.firebaseio.com/posts.json',
  //       postData
  //     )
  // }

  createAndStorePost(title: string, content: string) {
    const postData: Post = { title: title, content: content };
    // Send Http request
    console.log(postData);
    const request = false;
    this.http
      .post<{ name: string }> //optional but recommended
      (
        'https://angular-course-20f3b-default-rtdb.firebaseio.com/posts.json',
        postData,
        {
          //With observe I can change the kind of data I get back
          //observe: 'body' //body means that I get that response data extracted
          //and converted to a Javascript object automatically 
          observe: 'response' //reponse allow get full response object
        }
      ).subscribe(responseData => {
        //console.log(responseData.body);
        console.log(responseData);
        this.updateSubject.next(true);
      }, error => {
        console.log(error);
        this.errorSubject.next(error.message);
      });

  }

  //more elegant way of assigning the type
  fetchPost() {
    //If We want set up multiple params
    let searchParams = new HttpParams();
    searchParams = searchParams.append('print', 'pretty');
    searchParams = searchParams.append('custom', 'key');
    return this.http
      .get<{ [key: string]: Post }> //optional but recommended
      ('https://angular-course-20f3b-default-rtdb.firebaseio.com/posts.json',
        {
          headers: new HttpHeaders({
            "Custom-header": 'Hello'
          }),
          //params: new HttpParams().set('print', 'pretty') //This param is supported by FireBase
          //I can do that in the URL 
          params: searchParams,
          //responseType : 'text' //I get an error here because I'm using generic assignment
        })
      .pipe(//pipe method allows to funnel your observable data through multiple 
        //operators before they reach the subscribe method
        map(responseData => { //The map operator allows us to get some data and
          //return new data which is then automatically re-wrapped into an 
          //observable so that we can still subscribe to it
          const postsArray: Post[] = [];
          console.log('Kind' + JSON.stringify(responseData));
          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              postsArray.push({ ...responseData[key], id: key });
            }
          }
          return postsArray;
        }),
        catchError(errorRes => {
          //Send to analytics server
          return throwError(errorRes); //consider using catch error if you have
          //some generic error handling task you also want execute
        })
      );
  }

  deletePosts() {
    return this.http.delete('https://angular-course-20f3b-default-rtdb.firebaseio.com/posts.json',
      {
        //Tap operator allows us to execute some code without altering the response
        //not disturb our subscribe function and the functions we passed as arguments
        //to subscribe
        observe: 'events',
        responseType :'json' //Json is th default value, data of the response body is json
                      //Options: text, blob, ... review the documentation
      }
    ).pipe(
      tap(event => {
        console.log(event);
        if (event.type === HttpEventType.Sent){
          // ...
        }
        if (event.type === HttpEventType.Response){
          console.log(event.body);
        }
      })
    );
  }
}