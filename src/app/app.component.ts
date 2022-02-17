import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Post } from './post.model';
import { PostService } from './post.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  loadedPosts: Post[] = [];
  isFetching = false;
  error = null;

  private errorSubscribe: Subscription;
  private updatePostSubscribe: Subscription;

  constructor(private http: HttpClient,
    private postService: PostService) { }

  ngOnInit() {
    this.updatePostSubscribe = this.postService.updateSubject.subscribe(updatePosts => {
      console.log('Update posts!: ' + updatePosts)
      if (updatePosts) {
        this.fetchPost();
      }
    })
    this.errorSubscribe = this.postService.errorSubject.subscribe(errorMessage => {
      this.error = errorMessage;
      console.log("KIND: " + errorMessage)
    });
    this.fetchPost();
  }

  ngOnDestroy(): void {
    this.errorSubscribe.unsubscribe();
    this.updatePostSubscribe.unsubscribe();
  }

  private fetchPost() {
    this.isFetching = true;
    this.postService.fetchPost().subscribe(posts => {
      this.isFetching = false;
      this.loadedPosts = posts;
    }, error => {
      this.isFetching = false;
      //this.error = error.message;
      this.error = error.error['error'];
      console.log(error);
    });
  }

  // onCreatePost(postData: Post) {
  //   this.postService.createAndStorePost(postData.title, postData.content)
  //     .subscribe(() => {
  //       this.fetchPost();
  //     })
  // }

  onCreatePost(postData: Post) {
    this.postService.createAndStorePost(postData.title, postData.content);
  }

  onFetchPosts() {
    // Send Http request
    this.fetchPost();
  }

  onClearPosts() {
    // Send Http request
    this.postService.deletePosts().subscribe(() => {
      this.loadedPosts = [];
    })
  }

  // private fetchPosts() {
  //   this.http.get('https://angular-course-20f3b-default-rtdb.firebaseio.com/posts.json')
  //     .pipe(//pipe method allows to funnel your observable data through multiple 
  //         //operators before they reach the subscribe method
  //       map((responseData : {[key: string]: Post}) => { //The map operator allows us to get some data and
  //         //return new data which is then automatically re-wrapped into an 
  //         //observable so that we can still subscribe to it
  //         const postsArray: Post[] = [];
  //         console.log('Kind' + JSON.stringify(responseData));
  //         for (const key in responseData) {
  //           if (responseData.hasOwnProperty(key)) {
  //             postsArray.push({ ...responseData[key], id: key });
  //           }
  //         }
  //         return postsArray;
  //       })
  //     )
  //     .subscribe(posts => {
  //       console.log(posts);
  //     });
  // }


  // private fetchPosts() {
  //   this.http.get('https://angular-course-20f3b-default-rtdb.firebaseio.com/posts.json')
  //     .subscribe(posts => {
  //       console.log
  //     });
  // }

  onHandledError() {
    this.error = null;
  }
}
