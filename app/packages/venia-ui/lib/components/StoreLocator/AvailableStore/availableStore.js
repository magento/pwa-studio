/* eslint-disable react-hooks/exhaustive-deps */
import React, { useMemo } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import Dialog from '../../Dialog';

import { useStyle } from '../../../classify';
import defaultClasses from './availableStore.module.css';

const AvailableStore = props => {
    const classes = useStyle(defaultClasses);
    const { isOpen, onCancel, storesList } = props;
    const { formatMessage } = useIntl();
    const stores = useMemo(
        () =>
            storesList.map(store => {
                const { locationsData, productStock } = store;
                const { street, city, country, state_province, name } = locationsData;
                const address = street + ', ' + state_province + ' ' + city + ' ' + country;
                return (
                    <div className={classes.storeRow}>
                        <div className={classes.nameWrapper}>
                            <span>{name} </span>
                            <span>
                                {productStock === '0' ? (
                                    <FormattedMessage id={'galleryItem.outStock'} defaultMessage={'Out of stock'} />
                                ) : (
                                    <FormattedMessage id={'galleryItem.inStock'} defaultMessage={'In stock'} />
                                )}
                            </span>
                        </div>
                        <span className={classes.addressText} >{address}</span>
                    </div>
                );
            }),
        [storesList]
    );
    return (
        <>
            <Dialog
                onCancel={onCancel}
                isOpen={isOpen}
                shouldShowButtons={false}
                title={formatMessage({
                    id: 'storeLocator.availablePickupStore(s)',
                    defaultMessage: 'Available Pickup Store(s)'
                })}
                classes={{ dialog: classes.dialog, header: classes.header, contents: classes.contents }}
            >
                {stores}
            </Dialog>
        </>
    );
};

export default AvailableStore;
