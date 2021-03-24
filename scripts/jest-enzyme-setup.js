/**
 * @fileoverview Extracts out common test setup steps.
 * Jest will run this file before executing each test file.
 */
import Enzyme from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';

// Setup Enzyme's React 16 Adapter.
Enzyme.configure({ adapter: new Adapter() });
