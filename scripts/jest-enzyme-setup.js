/**
 * @fileoverview Extracts out common test setup steps.
 * Jest will run this file before executing each test file.
 */
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

// Setup Enzyme's React 16 Adapter.
Enzyme.configure({ adapter: new Adapter() });
