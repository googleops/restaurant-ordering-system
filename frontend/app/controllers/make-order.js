// app/controllers/make-order.js
import Controller from '@ember/controller';
import { action, computed } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class MakeOrderController extends Controller {
  @tracked items = this.model;

  @computed('items.@each.quantity')
  get totalItems() {
    return this.items.reduce((total, item) => total + Number(item.quantity), 0);
  }

  @computed('items.@each.price', 'items.@each.quantity')
  get totalPrice() {
    return this.items.reduce((total, item) => total + item.price * Number(item.quantity), 0);
  }

  @action
  updateQuantity(item, event) {
    let quantity = Number(event.target.value);
    item.quantity = quantity;
  }
}