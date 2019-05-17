// TODO: Move these tests to app.spec.js
// import React from 'react';

// import ErrorNotifications from '../errorNotifications';
// import { createTestInstance } from '@magento/peregrine';
// import AlertCircleIcon from 'react-feather/dist/icons/alert-circle';

// const mockAddToast = jest.fn();
// jest.mock('@magento/peregrine', () => {
//     const useToastActions = jest.fn(() => ({ addToast: mockAddToast }));

//     return {
//         ...jest.requireActual('@magento/peregrine'),
//         useToastActions
//     };
// });

// beforeEach(() => {
//     mockAddToast.mockClear();
// });
// test('adds no toasts when no errors are present', () => {
//     createTestInstance(
//         <ErrorNotifications errors={[]} onDismissError={() => {}} />
//     );

//     expect(mockAddToast).not.toHaveBeenCalled();
// });

// test('adds a toast when errors are present', () => {
//     createTestInstance(
//         <ErrorNotifications
//             errors={[
//                 {
//                     error: new Error('first error'),
//                     id: 'Error1',
//                     loc: 'stack trace here'
//                 },
//                 {
//                     error: new Error('second error'),
//                     id: 'Error2',
//                     loc: 'stack trace here 2'
//                 }
//             ]}
//             onDismissError={() => {}}
//         />
//     );
//     expect(mockAddToast).toHaveBeenCalledTimes(2);
//     expect(mockAddToast).toHaveBeenCalledWith(
//         expect.objectContaining({
//             type: 'error',
//             message: `Sorry! An unexpected error occurred.\nDebug: Error1 stack trace here`,
//             icon: AlertCircleIcon,
//             dismissable: true,
//             timeout: 7000,
//             onDismiss: expect.any(Function)
//         })
//     );
// });
