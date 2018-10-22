import { Page } from './abstract.page';

import { HeaderComponent } from '../components/header/header.component';
import { Model } from '../models/model';
import { UserModel } from '../models/user.model';
import { Injectable } from '../utils/ioc';
import { timerify } from '../utils/performance/timerify';
import { component } from '../utils/protractor/component';

@Injectable()
export class HomePage extends Page {

    @component('.header-ui') public readonly header!: HeaderComponent;

    public async open(): Promise<void> {
        return await super.open('https://epam.com');
    }

    @timerify()
    public fill<T extends Model<T>>(model: T): void {
        if (model instanceof UserModel) {
            console.dir(model.email);
            console.dir(model.username);
            console.dir(model.password);
        }
    }
}
