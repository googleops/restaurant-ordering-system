// app/controllers/profile.js
import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class ProfileController extends Controller {
  @service session;

  @action
  async saveProfile() {
    let url = `http://localhost:3000/api/customers/${this.model.id}?access_token=${this.session.token}`;

    let profile = {
      username: this.model.username,
      email: this.model.email,
      phone: this.model.phone,
      address: this.model.address,
      password: this.model.password,
    };

    try {
      let response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profile),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // handle successful save
    } catch (error) {
      // handle error
    }
  }
}
