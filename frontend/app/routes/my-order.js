import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class MyOrderRoute extends Route {
  @service session;

  async model() {
    let token = this.session.token;
    let response = await fetch(
      `http://localhost:3000/api/orders/my-orders?access_token=${token}`,
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    let orders = await response.json();
    // get order items (GET /orders/{id}/orderItems)
    let item_list = [];
    for (let order of orders) {
      let response = await fetch(
        `http://localhost:3000/api/orders/${order.id}/orderItems?access_token=${token}`,
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      let orderItems = await response.json();
      for (let orderItem of orderItems) {
        let response = await fetch(
          `http://localhost:3000/api/menuitems/${orderItem.menuItemId}?access_token=${token}`,
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        let menuItem = await response.json();
        orderItem.menuItem = menuItem;
      }

      item_list.push(orderItems);
    }

    return orders.map((order, index) => {
      order.item_list = item_list[index];
      return order;
    });
  }
}
