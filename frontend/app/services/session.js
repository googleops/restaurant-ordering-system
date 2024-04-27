// app/services/session.js
import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class SessionService extends Service {
  @tracked token = localStorage.getItem('token');
  @tracked ttl = localStorage.getItem('ttl');
  @tracked created = localStorage.getItem('created');
  @tracked userId = localStorage.getItem('userId');

  get isAuthenticated() {
    return !!this.token;
  }

  set(key, value) {
    this[key] = value;
    localStorage.setItem(key, value);
  }
}
