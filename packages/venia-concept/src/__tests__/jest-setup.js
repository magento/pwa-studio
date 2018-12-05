/**
 * @fileoverview Extracts out common test setup steps.
 * Jest will require this file for each test.
 */

import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

// Setup Enzyme's React 16 Adapter.
Enzyme.configure({ adapter: new Adapter() });
