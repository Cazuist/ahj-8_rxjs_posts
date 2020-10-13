import moment from 'moment';

export default class Comment {
  constructor(container, {
    id, avatar, content, created,
  }) {
    this.container = container;
    this.id = id;
    this.avatar = avatar;
    this.content = content;
    this.date = moment(created).format('hh:mm DD.MM.YY');

    this.bindToDOM();
  }

  // eslint-disable-next-line class-methods-use-this
  createHtml() {
    return `
      <div class="comment-task">
        <div class="avatar comment-task_avatar">
          <img src=${this.avatar}>
        </div>
        <div class="comment-task_content">
          <div class="comment-task_user-name">${this.author}</div>
          <div class="comment-task_content-box">${this.content}</div>
        </div>
        <div class="comment-task_date">${this.date}</div>
      </div>
    `;
  }

  bindToDOM() {
    this.container.insertAdjacentHTML('afterbegin', this.createHtml());
  }
}
