import React from 'react';
import { shape, string } from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Icon from '@magento/venia-ui/lib/components/Icon';
import { Paperclip, X as CloseIcon } from 'react-feather';
import { Form } from 'informed';
import Field from '@magento/venia-ui/lib/components/Field';
import TextArea from '@magento/venia-ui/lib/components/TextArea';
import defaultClasses from './quoteConversation.module.css';

const QuoteConversation = props => {
    const classes = useStyle(defaultClasses, props.classes);

    const conversationAttachment = (
        <div className={classes.attachmentBox}>
            <div className={classes.attachmentBoxTitle}>
                <Icon size={14} src={Paperclip} />
                <span className={classes.attachmentNum}>2</span>
                <FormattedMessage id={'quoteConversation.attachmentText'} defaultMessage={'Attachment(s)'} />
            </div>
            <div className={classes.attachmentFileRow}>
                <div className={classes.attachedFileBox}>
                    <Icon size={16} src={CloseIcon} />
                    <span className={classes.attachedFileBoxInfo}>
                        user.png <span className={classes.attachedFileSize}>(5 KB)</span>
                    </span>
                </div>
                <div className={classes.attachedFileBox}>
                    <Icon size={16} src={CloseIcon} />
                    <span className={classes.attachedFileBoxInfo}>
                        user.png <span className={classes.attachedFileSize}>(5 KB)</span>
                    </span>
                </div>
            </div>
        </div>
    );

    return (
        <div className={classes.root}>
            <div className={classes.blockContent}>
                <Form className={classes.conversationForm}>
                    <Field id={classes.content} label="Content">
                        <TextArea id="content" field="content" />
                    </Field>
                    <div className={classes.formActions}>
                        <div className={classes.fileInputButton}>
                            <span className={classes.fileInputLabel}>
                                <FormattedMessage
                                    id={'quoteConversation.fileInputLabelText'}
                                    defaultMessage={'Attach File'}
                                />
                            </span>
                            <input id="file-upload" multiple="multiple" name="image" type="file" />
                        </div>
                    </div>
                    <div className={classes.formNotes}>
                        <FormattedMessage
                            id={'quoteConversation.formNotesText'}
                            defaultMessage={'Support png,pdf,jpg,jpeg,doc,zip'}
                        />
                    </div>
                    {conversationAttachment}
                </Form>
            </div>
        </div>
    );
};

export default QuoteConversation;

QuoteConversation.propTypes = {
    classes: shape({
        root: string,
        formNotes: string,
        fileInputLabel: string,
        fileInputButton: string,
        formActions: string,
        conversationForm: string,
        blockContent: string,
        blockTitle: string,
        attachedFileSize: string,
        attachedFileBoxInfo: string,
        attachedFileBox: string,
        attachmentFileRow: string,
        attachmentNum: string,
        attachmentBoxTitle: string,
        attachmentBox: string
    })
};
