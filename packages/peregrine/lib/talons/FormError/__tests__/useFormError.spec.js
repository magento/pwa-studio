import React from 'react';

import { useFormError } from '../useFormError';
import createTestInstance from '../../../util/createTestInstance';

jest.mock('react-intl', () => ({
    useIntl: jest.fn().mockReturnValue({
        formatMessage: jest.fn().mockImplementation(options => options.id)
    })
}));

const Component = props => {
    const talonProps = useFormError(props);
    return <i talonProps={talonProps} />;
};

test('return no error message', () => {
    const tree = createTestInstance(<Component errors={[]} />);
    const { root } = tree;
    const { talonProps } = root.findByType('i').props;

    expect(talonProps.errorMessage).toEqual('');
});

test('filters out falsey errors', () => {
    const tree = createTestInstance(
        <Component errors={[undefined, null, 0]} />
    );
    const { root } = tree;
    const { talonProps } = root.findByType('i').props;

    expect(talonProps.errorMessage).toEqual('');
});

test('returns concatenated error message when allowErrorMessages', () => {
    const graphQLError = {
        graphQLErrors: [
            { message: 'GraphQL Error 1' },
            { message: 'GraphQL Error 2' }
        ]
    };

    const tree = createTestInstance(
        <Component errors={[graphQLError]} allowErrorMessages />
    );
    const { root } = tree;
    const { talonProps } = root.findByType('i').props;

    expect(talonProps.errorMessage).toMatchSnapshot();
});

test('returns general error message', () => {
    const graphQLError = {
        graphQLErrors: [
            { message: 'GraphQL Error 1' },
            { message: 'GraphQL Error 2' }
        ]
    };

    const genericError = { message: 'Generic Error' };

    const tree = createTestInstance(
        <Component errors={[graphQLError, genericError]} />
    );
    const { root } = tree;
    const { talonProps } = root.findByType('i').props;

    expect(talonProps.errorMessage).toMatchSnapshot();
});
