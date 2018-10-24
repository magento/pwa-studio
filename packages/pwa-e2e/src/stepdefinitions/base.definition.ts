import { events, Status } from 'cucumber';
import { after, before, binding } from 'cucumber-tsflow';
import { writeFile } from 'fs';
import { browser } from 'protractor';

@binding()
export class BaseDefinition {

    @after()
    public async write(scenarioResult: events.ScenarioResultPayload): Promise<void> {
        if (scenarioResult.status === Status.FAILED || scenarioResult.status === Status.UNDEFINED) {
            console.dir(scenarioResult.scenario.name + ' failed');
        }
    }

    @before()
    public setUp(): void {
        console.dir('before hook');
    }
}
