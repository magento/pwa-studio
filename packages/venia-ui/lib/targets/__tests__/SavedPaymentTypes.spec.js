import SavedPaymentTypes from '../SavedPaymentTypes';

const add = jest.fn().mockName('esModuleObject.add');

const esModuleObject = jest
    .fn()
    .mockName('esModuleObject')
    .mockReturnValue({
        add
    });

const venia = {
    esModuleObject
};

test('Should return correct shape', () => {
    const savedPaymentTypes = new SavedPaymentTypes(venia);

    expect(savedPaymentTypes).toMatchSnapshot();
});

test('Should add new import when add is called', () => {
    const savedPaymentTypes = new SavedPaymentTypes(venia);

    const paymentCode = 'braintree';
    const importPath = 'path/to/the/component.js';
    savedPaymentTypes.add({
        paymentCode,
        importPath
    });

    expect(add).toHaveBeenCalledWith(
        `import ${paymentCode} from '${importPath}'`
    );
});
