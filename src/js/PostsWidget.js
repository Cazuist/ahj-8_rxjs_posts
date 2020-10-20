import {
  fromEvent, Observable, forkJoin,
} from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

import Post from './Post';
import Comment from './Comment';

export default class PostsWidget {
  constructor(container, url) {
    this.container = container;
    this.url = url;
  }

  init() {
    this.bindToDOM();
    this.initElements();
    this.registerListeners();
  }

  // eslint-disable-next-line class-methods-use-this
  createHtml() {
    return `
      <div class="manager-box">
        <header class="manager-header">
          <div class="dots">
            <span class="dot dot-1"></span>
            <span class="dot dot-2"></span>
            <span class="dot dot-3"></span>
          </div>
          <h3 class="manager-header_title">Posts v.1.0</h3>
        </header>

        <section class="manger-posts">
          <footer class="manager-footer">
            <span class="footer_load">Load More</span> 
          </footer>
        </section>    
      </div> 
   `;
  }

  bindToDOM() {
    this.container.insertAdjacentHTML('beforeend', this.createHtml());
  }

  registerListeners() {
    fromEvent(document, 'DOMContentLoaded').subscribe(() => this.onDocumentLoad());
  }

  initElements() {
    this.postBoxEl = document.querySelector('.manger-posts');
  }

  onDocumentLoad() {
    const post$ = this.getRequest(`${this.url}/posts/latest`);

    post$.pipe(
      switchMap((posts) => {
        const postsWithComments$ = posts.map((post) => this.getRequest(`${this.url}/posts/${post.id}/comments/latest?id=${post.id}`)
          .pipe(
            map((comments) => ({ ...post, comments })),
          ));

        return forkJoin(postsWithComments$);
      }),
    ).subscribe((postsData) => this.drawPosts(postsData));
  }

  drawPosts(posts) {
    posts.forEach((post) => {
      // eslint-disable-next-line no-new
      new Post(this.postBoxEl, post);
      const commentBoxEl = document.querySelector('.comments-box_tascks');

      post.comments.forEach((comment) => {
        // eslint-disable-next-line no-new
        new Comment(commentBoxEl, comment);
      });
    });
  }

  // eslint-disable-next-line class-methods-use-this
  getRequest(url) {
    return new Observable((observer) => {
      const controller = new AbortController();

      fetch(url, {
        signal: controller.signal,
      })
        .then((response) => response.json())
        .then((data) => {
          observer.next(data);
          observer.complete();
        })
        .catch((err) => observer.error(err));

      return () => controller.abort();
    });
  }
}
