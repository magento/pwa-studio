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
    }

    @given(/^User open "home" page$/)
    public async someMethod(): Promise<void> {
        await this.home.open();
        await browser.sleep(5000);
    }
}
