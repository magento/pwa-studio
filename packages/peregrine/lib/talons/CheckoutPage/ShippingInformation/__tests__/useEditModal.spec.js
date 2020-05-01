import { useAppContext } from '../../../../context/app';
import { useEditModal } from '../useEditModal';

jest.mock('../../../../context/app', () => ({
    useAppContext: jest.fn()
}));

describe('return correct open status', () => {
    test('edit modal is closed', () => {
        useAppContext.mockReturnValueOnce([
            { drawer: null },
            { closeDrawer: jest.fn() }
        ]);

        const talonProps = useEditModal();
        expect(talonProps.isOpen).toEqual(false);
    });

    test('edit modal is open', () => {
        useAppContext.mockReturnValueOnce([
            { drawer: 'shippingInformation.edit' },
            { closeDrawer: jest.fn() }
        ]);

        const talonProps = useEditModal();
        expect(talonProps.isOpen).toEqual(true);
    });
});

test('close handler passed', () => {
    const closeDrawer = jest.fn();
    useAppContext.mockReturnValueOnce([{ drawer: null }, { closeDrawer }]);

    const talonProps = useEditModal();
    expect(talonProps.handleClose).toEqual(closeDrawer);
});
