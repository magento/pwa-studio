import React, { Suspense } from 'react';
import { useIntl } from 'react-intl';

import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';
import { useStyle } from '@magento/venia-ui/lib/classify';
import { Accordion, Section } from '@magento/venia-ui/lib/components/Accordion';
import defaultClasses from './quotePriceAdjustments.module.css';

const QuoteConversation = React.lazy(() => import('./QuoteConversation'));

const QuotePriceAdjustments = props => {
    const classes = useStyle(defaultClasses, props.classes);

    const { formatMessage } = useIntl();

    return (
        <div className={classes.root}>
            <Accordion canOpenMultiple={true}>
                <Section
                    id={'quote_conversation'}
                    title={formatMessage({
                        id: 'quotePriceAdjustments.conversation',
                        defaultMessage: 'Conversation'
                    })}
                >
                    <Suspense fallback={<LoadingIndicator />}>
                        <QuoteConversation />
                    </Suspense>
                </Section>
            </Accordion>
        </div>
    );
};

export default QuotePriceAdjustments;

QuotePriceAdjustments.propTypes = {};
