import Route from '@ember/routing/route';

export default class MenuRoute extends Route {
  async model() {
    let response = await fetch('http://localhost:3000/api/menuitems');
    let data = await response.json();
    return data;
  }
}
