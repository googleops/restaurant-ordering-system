// app/components/header-component.js
import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class HeaderComponent extends Component {
  @service session;
  @service router;

  @action
  handleLogout() {
    // Clear session data
    this.session.invalidate();

    // Redirect to login page
    this.router.transitionTo('login');
  }
}
