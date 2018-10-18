import { HookScenarioResult, Status } from 'cucumber';
import { after, before, binding } from 'cucumber-tsflow';

import { browser } from 'protractor';

@binding()
export class BaseDefinition {

    @after()
    public async write(scenario: HookScenarioResult): Promise<void> {
        // some
        if (scenario.result.status === Status.FAILED) {
            const base64 = await browser.takeScreenshot();
            console.dir(`fail test image: ${base64}`);
        }
    }

    @before()
    public setUp(): void {
        // setup
        console.dir('before hook');
    }
}
