import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class LoginFormComponent extends Component {
    @service session;
    @tracked username = '';
    @tracked password = '';

    @action
    updateUsername(event) {
        this.username = event.target.value;
    }

    @action
    updatePassword(event) {
        this.password = event.target.value;
    }
    @action
    async handleLogin(event) {
        event.preventDefault();

        let requestBody = JSON.stringify({ username: this.username, password: this.password });
        console.log('Request body:', requestBody);

        let response = await fetch('http://localhost:3000/api/customers/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: requestBody
        });

        console.log('Response:', response);

        if (response.ok) {
            let { id, ttl, created, userId } = await response.json();
            this.session.set('token', id);
            this.session.set('ttl', ttl);
            this.session.set('created', created);
            this.session.set('userId', userId);
            // Redirect to home page or other page here
        } else {
            alert('Login failed');
        }
    }
}