import React from 'react';
import { string, bool, shape } from 'prop-types';
import { Eye, EyeOff } from 'react-feather';

import { mergeClasses } from '@magento/venia-ui/lib/classify';
import { usePassword } from '@magento/peregrine/lib/talons/Password/usePassword';

import Button from '../Button';
import Field from '../Field';
import TextInput from '../TextInput';
import { isRequired } from '../../util/formValidators';

import defaultClasses from './password.css';

const Password = props => {
    const {
        classes: propClasses,
        label,
        fieldName,
        isToggleButtonHidden
    } = props;
    const talonProps = usePassword();
    const { visible, togglePasswordVisibility } = talonProps;
    const classes = mergeClasses(defaultClasses, propClasses);

    const passwordButton = (
        <Button
            className={classes.passwordButton}
            onClick={togglePasswordVisibility}
            type="button"
        >
            {visible ? <EyeOff /> : <Eye />}
        </Button>
    );

    const fieldType = visible ? 'text' : 'password';

    return (
        <Field label={label} classes={{ root: classes.root }}>
            <TextInput
                field={fieldName}
                type={fieldType}
                validate={isRequired}
                after={!isToggleButtonHidden && passwordButton}
            />
        </Field>
    );
};

Password.propTypes = {
    classes: shape({
        root: string
    }),
    label: string,
    fieldName: string,
    isToggleButtonHidden: bool
};

Password.defaultProps = {
    isToggleButtonHidden: true
};

export default Password;
