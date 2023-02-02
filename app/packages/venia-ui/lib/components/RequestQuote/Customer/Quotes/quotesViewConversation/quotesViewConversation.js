import React from 'react';
import { shape, string } from 'prop-types';
import { useIntl, FormattedMessage } from 'react-intl';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Icon from '@magento/venia-ui/lib/components/Icon';
import { Paperclip, X as CloseIcon } from 'react-feather';
import { Form } from 'informed';
import Button from '@magento/venia-ui/lib/components/Button';
import Field from '@magento/venia-ui/lib/components/Field';
import TextArea from '@magento/venia-ui/lib/components/TextArea';
import defaultClasses from './quotesViewConversation.module.css';

const QuotesViewConversation = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const { formatMessage } = useIntl();
    const BLOCK_TITLE = formatMessage({
        id: 'quotesViewConversation.blockTitleText',
        defaultMessage: 'Conversation'
    });

    const conversationAttachment = (
        <div className={classes.attachmentBox}>
            <div className={classes.attachmentBoxTitle}>
                <Icon size={14} src={Paperclip} />
                <span className={classes.attachmentNum}>2</span>
                <FormattedMessage id={'quotesViewConversation.attachmentText'} defaultMessage={'Attachment(s)'} />
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

    const conversationMessages = (
        <div className={classes.box}>
            <div className={classes.boxHeader}>
                <strong className={classes.author}>
                    <FormattedMessage id={'quotesViewConversation.submitText'} defaultMessage={'Admin'} />
                </strong>
                <FormattedMessage
                    id={'quotesViewConversation.submitText'}
                    defaultMessage={' replied, in a few seconds (Tue, 21 Sep 2021 at 01:41 AM)'}
                />
            </div>
            <div className={classes.boxContent}>
                <p>test</p>
            </div>
            <div className={classes.boxAttachments}>
                <div className={classes.attachedFile}>
                    <span className={classes.attachedFileInfo}>user.png</span>
                </div>
                <div className={classes.attachedFile}>
                    <span className={classes.attachedFileInfo}>user-old.png</span>
                </div>
            </div>
        </div>
    );

    const conversationCustomerMessages = (
        <div className={[classes.box, classes.customerReply].join(' ')}>
            <div className={classes.boxHeader}>
                <strong className={classes.author}>
                    <FormattedMessage id={'quotesViewConversation.submitText'} defaultMessage={'Jayram Prajapati'} />
                </strong>
                <FormattedMessage
                    id={'quotesViewConversation.submitText'}
                    defaultMessage={' replied, 4 days ago (Fri, 17 Sep 2021 at 03:24 AM)'}
                />
            </div>
            <div className={classes.boxContent}>
                <p>test</p>
            </div>
            <div className={classes.boxAttachments}>
                <div className={classes.attachedFile}>
                    <span className={classes.attachedFileInfo}>user.png</span>
                </div>
                <div className={classes.attachedFile}>
                    <span className={classes.attachedFileInfo}>user-old.png</span>
                </div>
            </div>
        </div>
    );

    return (
        <div className={classes.root}>
            <div className={classes.blockTitle}>{BLOCK_TITLE}</div>
            <div className={classes.blockContent}>
                <Form className={classes.conversationForm}>
                    <Field id={classes.content} label="Content">
                        <TextArea id="content" field="content" />
                    </Field>
                    <div className={classes.formActions}>
                        <div className={classes.fileInputButton}>
                            <span className={classes.fileInputLabel}>
                                <FormattedMessage
                                    id={'quotesViewConversation.fileInputLabelText'}
                                    defaultMessage={'Attach File'}
                                />
                            </span>
                            <input id="file-upload" multiple="multiple" name="image" type="file" />
                        </div>
                        <Button type="submit" priority="high">
                            <FormattedMessage id={'quotesViewConversation.submitText'} defaultMessage={'Submit'} />
                        </Button>
                    </div>
                    <div className={classes.formNotes}>
                        <FormattedMessage
                            id={'quotesViewConversation.formNotesText'}
                            defaultMessage={'Support png,pdf,jpg,jpeg,doc,zip'}
                        />
                    </div>
                    {conversationAttachment}
                    {conversationMessages}
                    {conversationCustomerMessages}
                </Form>
            </div>
        </div>
    );
};

export default QuotesViewConversation;

QuotesViewConversation.propTypes = {
    classes: shape({
        root: string
    })
};
