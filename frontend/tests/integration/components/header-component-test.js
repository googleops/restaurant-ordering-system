import { module, test } from 'qunit';
import { setupRenderingTest } from 'frontend/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | header-component', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`<HeaderComponent />`);

    assert.dom().hasText('');

    // Template block usage:
    await render(hbs`
      <HeaderComponent>
        template block text
      </HeaderComponent>
    `);

    assert.dom().hasText('template block text');
  });
});
