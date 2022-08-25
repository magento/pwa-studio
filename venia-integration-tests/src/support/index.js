import './accountCommands';
import './fullPageScreenshotCommand';
import './helperCommands';
import './loadFullPageCommand';
import './routesCommands';
import './visitPageCommand';
import './networkCommands';
import './exceptions';

import { addMatchImageSnapshotCommand } from 'cypress-image-snapshot/command';

addMatchImageSnapshotCommand();

import registerCypressGrep from 'cypress-grep';

registerCypressGrep();
