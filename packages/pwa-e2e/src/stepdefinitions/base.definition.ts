import { events, Status } from 'cucumber';
import { after, before, binding } from 'cucumber-tsflow';
import { writeFile } from 'fs';
import { browser } from 'protractor';

@binding()
export class BaseDefinition {

    @after()
    public async write(scenarioResult: events.ScenarioResultPayload): Promise<void> {
        // some
        if (scenarioResult.status === Status.FAILED || scenarioResult.status === Status.UNDEFINED) {
            console.dir(scenarioResult.scenario.name + ' failed');
            const screenShot = await browser.takeScreenshot();
            writeFile('reports/screenshots/error.png', screenShot, 'base64', err => {
                // tslint:disable-next-line:no-console
                console.error(err);
            });
        }
    }

    @before()
    public setUp(): void {
        // setup
        console.dir('before hook');
        // console.dir(scenario);
    }
}
