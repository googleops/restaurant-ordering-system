// app/controllers/make-order.js
import Controller from '@ember/controller';
import { action, computed } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import fetch from 'fetch';
import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';

export default class MakeOrderController extends Controller {
  @service session;
  @service router;
  @tracked items = this.model;

  @computed('items.@each.quantity')
  get totalItems() {
    return this.items.reduce((total, item) => total + Number(item.quantity), 0);
  }

  @computed('items.@each.price', 'items.@each.quantity')
  get totalPrice() {
    return this.items.reduce(
      (total, item) => total + item.price * Number(item.quantity),
      0,
    );
  }

  @action
  updateQuantity(item, event) {
    let quantity = Number(event.target.value);
    item.quantity = quantity;
  }

  @action
  async placeOrder() {
    let token = this.session.token; // replace with your actual token
    let discount = 0; // replace with your actual discount
    let itemList = this.items
      .filter((item) => item.quantity > 0)
      .map((item) => ({ menu_item_id: item.id, quantity: item.quantity }));

    let response = await fetch(
      `http://localhost:3000/api/orders/newOrder?access_token=${token}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          discount,
          item_list: itemList,
        }),
      },
    );

    if (!response.ok) {
      // handle error
    }

    // handle successful order
    // redirect to my orders page
    this.router.transitionTo('my-order');
  }
}
