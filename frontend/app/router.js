import EmberRouter from '@ember/routing/router';
import config from 'frontend/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('menu');
  this.route('login');
  this.route('profile');
  this.route('not-found', { path: '/*path' });
  this.route('my-order');
  this.route('make-order');
  this.route('register');
});
