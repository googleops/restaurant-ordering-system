// app/controllers/register.js
import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';

export default class RegisterController extends Controller {

    @service session;
    @service router;
    

    @action
    async register() {
        let url = 'http://localhost:3000/api/customers';

        let user = {
            username: this.model.username,
            email: this.model.email,
            phone: this.model.phone,
            address: this.model.address,
            password: this.model.password,
        };

        try {
            let response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // handle successful registration
            this.router.transitionTo('login');
        } catch (error) {
            // handle error
            if (error instanceof Error) {
                let errorMessage = error.message;
                if (errorMessage.includes('409')) {
                    alert('User already exists');
                } else if (errorMessage.includes('422')) {
                    alert('User already exists'); 
                }else {
                    alert('An error occurred. Please try again later.');
                }
            }
        }
    }
}