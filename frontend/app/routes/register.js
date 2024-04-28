// app/routes/register.js
import Route from '@ember/routing/route';

export default class RegisterRoute extends Route {
  setupController(controller) {
    super.setupController(controller);
    controller.set('model', {});
  }
}