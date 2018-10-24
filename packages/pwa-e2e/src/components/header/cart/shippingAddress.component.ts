import { ElementFinder } from 'protractor';

import { Component } from 'components/abstract.component';

export class ShippingAddressComponent extends Component {
  private readonly $header: ElementFinder = this.root.$('.address-body-1MH');

  public async getFormName(): Promise<string> {
    return await this.$header.getText();
  }
  public async fillForm(
    firstName: string,
    lastname: string,
    street: string,
    city: string,
    zip: string,
    state: string,
    phone: string,
    email: string
  ): Promise<void> {
    await this.root.$('[id*=address-firstname]').sendKeys(firstName);
    await this.root.$('#address-lastname-2Az').sendKeys(lastname);
    await this.root.$('#address-street0-3gt').sendKeys(street);
    await this.root.$('#address-city-2Ao').sendKeys(city);
    await this.root.$('#address-postcode-9pz').sendKeys(zip);
    await this.root.$('#address-region_code-1m9').sendKeys(state);
    await this.root.$('#address-telephone-3If').sendKeys(phone);
    await this.root.$('#address-email-28j').sendKeys(email);
  }
}