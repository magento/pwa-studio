import axios from 'axios';
import { after, before, binding } from 'cucumber-tsflow';

import { readFileSync } from 'fs';
import { browser } from 'protractor';

@binding()
export class BaseDefinition {

    @after()
    public static writeLog(): void {
        // some
        console.dir('after hook');
    }
    @before()
    public setUp(): void {
        // setup
        console.dir('before hook');
    }
}
