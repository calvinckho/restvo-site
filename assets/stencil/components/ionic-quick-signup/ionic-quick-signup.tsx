import 'ionicons';

import {
  Component, Prop, h
} from '@stencil/core';

declare var window: any;

@Component({
  tag: 'ionic-quick-signup',
  styleUrl: 'ionic-quick-signup.scss',
  shadow: false
})
export class IonicQuickSignup {
  hsidRef: HTMLInputElement;

  @Prop() showPricingNotice = false;
  @Prop() buttonColor = 'white';
  @Prop() transparentInput = false;

  handleSubmit(_: Event) {
    var hsutk = window.getCookie('hubspotutk');
    if (this.hsidRef) this.hsidRef.value = hsutk;
    return true;
  }

  render() {
    return (
      <form
        class={`form quick-signup-form ${this.transparentInput ? 'transparent-input' : ''}`}
        role="form"
        action="/signup"
        method="GET"
        onSubmit={e => this.handleSubmit(e)}
        >
        <input type="hidden" name="hsid" ref={e => this.hsidRef = e} />
        <input type="hidden" name="source" value="homepage-quick" />
        <div class="form-group" id="field-email">
          <div class="row">
            <div class="col-sm-8 input-col">
              <input
                class="form-control"
                type="email"
                placeholder="Enter your email address"
                id="id_email"
                name="email"
                spellcheck="false"
                required />
            </div>
            <div class="col-sm-4">
              <button type="submit" class={`btn ${this.buttonColor}`}>
                Get started
              </button>
            </div>
          </div>
        </div>
        {this.showPricingNotice ? (
          <div class="form-group">
            Ionic is free and open source for all developers. We also offer <a href="/pricing">enterprise options</a> for teams
            that need support and premium features.
          </div>
        ) : null}
      </form>
    );
  }
}
