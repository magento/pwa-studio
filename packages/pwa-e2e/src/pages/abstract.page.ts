import { browser } from 'protractor';
import { Model } from '../models/model';

export abstract class Page {
    public constructor(public url?: string) { }

    public async open(url?: string): Promise<void> {
        await browser.get(url || this.url || '');
    }
    public async getTitle(): Promise<string> {
        return browser.getTitle();
    }

    public abstract fill<T extends Model<T>>(model: T): void;
}
