import { binding, given } from 'cucumber-tsflow';
import { browser } from 'protractor';

import { UserModel } from '../models/user.model';
import { HomePage } from '../pages/home.page';
import { Inject } from '../utils/ioc';
import { BaseDefinition } from './base.definition';

@binding()
class Temp extends BaseDefinition {
    @Inject()
    private home!: HomePage;

    public constructor() {
        super();
        this.home.open();
        browser.driver.toggleAirplaneMode();
    }

    @given(/^User open "home" page$/)
    public someMethod(): void {
        this.home.open();
    }
}
