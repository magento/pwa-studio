import DrawerFooter from '../../../../components/DrawerFooter/DrawerFooter';

<DrawerFooter
    buttonsConfig={[
        {
            contents: 'Normal Button',
            key: 'normalButton',
            priority: 'normal'
        },
        {
            contents: 'Submit Button',
            key: 'submitButton',
            priority: 'normal',
            type: 'submit',
            onClick: console.log
        }
    ]}
/>
