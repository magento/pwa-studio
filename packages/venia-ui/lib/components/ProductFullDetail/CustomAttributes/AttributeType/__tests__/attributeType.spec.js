import React from 'react';

import { createTestInstance } from '@magento/peregrine';

import AttributeType from '../attributeType';

// jest.mock('@magento/peregrine/lib/talons/ProductFullDetail/CustomAttributes/AttributeType', () => ({
//     useAttributeType: jest.fn(() => {
//         return {
//             getAttributeTypeConfig: jest.fn().mockImplementation(() => {
//                 return 'test';
//             })
//         };
//     })
// }));

jest.mock('../Boolean', () => props => <mock-Boolean {...props} />);
jest.mock('../Date', () => props => <mock-Date {...props} />);
jest.mock('../DateTime', () => props => <mock-DateTime {...props} />);
jest.mock('../Multiselect', () => props => <mock-Multiselect {...props} />);
jest.mock('../Price', () => props => <mock-Price {...props} />);
jest.mock('../Select', () => props => <mock-Select {...props} />);
jest.mock('../Text', () => props => <mock-Text {...props} />);
jest.mock('../Textarea', () => props => <mock-Textarea {...props} />);

let inputProps = {};

const Component = () => {
    return <AttributeType {...inputProps} />;
};

describe('#AttributeType', () => {
    it('renders null when no data is provided', () => {
        const tree = createTestInstance(<Component />);

        expect(tree.toJSON()).toMatchSnapshot();
    });

    it('renders null when type is not found', () => {
        inputProps = {
            data: {
                attribute_metadata: {
                    ui_input: {
                        ui_input_type: 'FAKETYPE'
                    }
                }
            }
        };
        const tree = createTestInstance(<Component />);

        expect(tree.toJSON()).toMatchSnapshot();
    });

    it('renders boolean attribute type component', () => {
        inputProps = {
            data: {
                attribute_metadata: {
                    ui_input: {
                        ui_input_type: 'BOOLEAN'
                    }
                }
            }
        };
        const tree = createTestInstance(<Component />);

        expect(tree.toJSON()).toMatchSnapshot();
    });

    it('renders date attribute type component', () => {
        inputProps = {
            data: {
                attribute_metadata: {
                    ui_input: {
                        ui_input_type: 'DATE'
                    }
                }
            }
        };
        const tree = createTestInstance(<Component />);

        expect(tree.toJSON()).toMatchSnapshot();
    });

    it('renders date time attribute type component', () => {
        inputProps = {
            data: {
                attribute_metadata: {
                    ui_input: {
                        ui_input_type: 'DATETIME'
                    }
                }
            }
        };
        const tree = createTestInstance(<Component />);

        expect(tree.toJSON()).toMatchSnapshot();
    });

    it('renders multiselect attribute type component', () => {
        inputProps = {
            data: {
                attribute_metadata: {
                    ui_input: {
                        ui_input_type: 'MULTISELECT'
                    }
                }
            }
        };
        const tree = createTestInstance(<Component />);

        expect(tree.toJSON()).toMatchSnapshot();
    });

    it('renders price attribute type component', () => {
        inputProps = {
            data: {
                attribute_metadata: {
                    ui_input: {
                        ui_input_type: 'PRICE'
                    }
                }
            }
        };
        const tree = createTestInstance(<Component />);

        expect(tree.toJSON()).toMatchSnapshot();
    });

    it('renders select attribute type component', () => {
        inputProps = {
            data: {
                attribute_metadata: {
                    ui_input: {
                        ui_input_type: 'SELECT'
                    }
                }
            }
        };
        const tree = createTestInstance(<Component />);

        expect(tree.toJSON()).toMatchSnapshot();
    });

    it('renders text attribute type component', () => {
        inputProps = {
            data: {
                attribute_metadata: {
                    ui_input: {
                        ui_input_type: 'TEXT'
                    }
                }
            }
        };
        const tree = createTestInstance(<Component />);

        expect(tree.toJSON()).toMatchSnapshot();
    });

    it('renders textarea attribute type component', () => {
        inputProps = {
            data: {
                attribute_metadata: {
                    ui_input: {
                        ui_input_type: 'TEXTAREA'
                    }
                }
            }
        };
        const tree = createTestInstance(<Component />);

        expect(tree.toJSON()).toMatchSnapshot();
    });
});
