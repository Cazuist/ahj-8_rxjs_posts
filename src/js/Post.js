import moment from 'moment';

export default class Post {
  constructor(container, {
    id, author, created, avatar,
  }) {
    this.container = container;
    this.id = id;
    this.author = author;
    this.date = moment(created).format('hh:mm DD.MM.YY');
    this.avatar = avatar;

    this.bindToDOM();
  }

  // eslint-disable-next-line class-methods-use-this
  createHtml() {
    return `
      <div class="manger-post" data-id=${this.id}>
        <div class="manager-posts_post-box">
          <header class="post-box_header">
            <div class="avatar post-box_avatar">
              <img src=${this.avatar}>
            </div>
            <div class="info-box">
              <div class="post-box_user-name">${this.author}</div>
              <div class="post-box_user-date">${this.date}</div>
            </div>
          </header>
          <div class="post-box_content"></div>
        </div>

        <div class="manager-posts_comments-box">
          <div class="comments-box_title">Latest comments:</div> 
          
          <div class="comments-box_tascks">
          </div> 
        </div>        
      </div>
    `;
  }

  bindToDOM() {
    this.container.insertAdjacentHTML('afterbegin', this.createHtml());
  }
}
