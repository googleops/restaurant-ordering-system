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

        let requestBody = JSON.stringify({
            username: this.username,
            password: this.password,
        });
        console.log('Request body:', requestBody);

        let response = await fetch('http://localhost:3000/api/customers/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: requestBody,
        });

        console.log('Response:', response);

        if (response.ok) {
            let { id, ttl, created, userId } = await response.json();
            console.log('id:', id);
            console.log('ttl:', ttl);
            console.log('created:', created);
            console.log('userId:', userId);

            this.session.set('token', id);
            this.session.set('ttl', ttl);
            this.session.set('created', created);
            this.session.set('userId', userId);

            console.log('this.session.token:', this.session.token);
            console.log('this.session.ttl:', this.session.ttl);
            console.log('this.session.created:', this.session.created);
            console.log('this.session.userId:', this.session.userId);

            // Redirect to home page
            this.args.onSuccess();
        } else {
            alert('Login failed');
        }
    }
}
