const SUCCESS = undefined;
let input = null;

export const hasIntegerValue = (value, values, id) => {
    if (input == null) {
        input = document.querySelector('#' + id);
    }

    const message = {
        id: 'validation.hasIntegerValue',
        defaultMessage: 'Only number will be allow.'
    };
    if (!value.match(/^\d+/)) {
        input.scrollIntoView({
            behavior: 'auto',
            block: 'center',
            inline: 'center'
        });
        return message;
    }

    input = null;

    return SUCCESS;
};

export const hasEmail = (value, values, id) => {
    if (input == null) {
        input = document.querySelector('#' + id);
    }

    const message = {
        id: 'validation.hasEmail',
        defaultMessage: 'Invalid email format.'
    };
    if (!value.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
        input.scrollIntoView({
            behavior: 'auto',
            block: 'center',
            inline: 'center'
        });
        return message;
    }

    input = null;

    return SUCCESS;
};

export const isRequired = (value, values, id) => {
    if (input == null) {
        input = document.querySelector('#' + id);
    }

    const FAILURE = {
        id: 'validation.isRequired',
        defaultMessage: 'Is required.'
    };
    if (!value) {
        input.scrollIntoView({
            behavior: 'auto',
            block: 'center',
            inline: 'center'
        });
        return FAILURE;
    }

    const stringValue = String(value).trim();
    const measureResult = hasLengthAtLeast(stringValue, null, 1);

    if (measureResult) {
        input.scrollIntoView({
            behavior: 'auto',
            block: 'center',
            inline: 'center'
        });
        return FAILURE;
    }

    input = null;

    return SUCCESS;
};

export const hasLengthAtLeast = (value, values, minimumLength) => {
    const message = {
        id: 'validation.hasLengthAtLeast',
        defaultMessage: 'Must contain more characters',
        value: minimumLength
    };
    if (!value || value.length < minimumLength) {
        return message;
    }

    return SUCCESS;
};
