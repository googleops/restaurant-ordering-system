import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class ProfileRoute extends Route {
  @service session;

  async model() {
    let userId = this.session.userId;
    let token = this.session.token;
    console.log('userId', userId);
    console.log('token', token);
    let response = await fetch(`http://localhost:3000/api/customers/${userId}?access_token=${token}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  
    let user = await response.json();
    user.name = user.username; // or any other property that represents the user's name
    console.log('user', user);
    return user;
  }
}