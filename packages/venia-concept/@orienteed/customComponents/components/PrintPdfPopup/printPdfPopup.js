import React, { useState } from 'react';
import { usePrintPdfContext } from '../PrintPdfProvider/printPdfProvider';
import defaultClasses from './printPdfPopup.module.css';
import ItemCard from './itemCard';

import { FormattedMessage } from 'react-intl';
import ItemSummaryCard from './itemSummaryCard';
import Dropzone from './Dropzone';
import ImagesList from './imagesList';
import Button from '@magento/venia-ui/lib/components/Button';
import CustomDialog from './customDialog';

const PrintPdfPopup = React.forwardRef((props, ref) => {
    const { openPopup, handleClosePopup, handlePrint } = props;
    const { priceSummary, cartItem } = usePrintPdfContext();
    const [tooglePrice, setTooglePrice] = useState(false);
    const [companyInfo, setCompanyInfo] = useState(
        " Company info, Información de la compañía, Informação da companhia, Information d'entreprise"
    );

    const infoCompany = <FormattedMessage id={'companyInfo'} defaultMessage={'Company Info'} />;

    const productTitle = <FormattedMessage id={'productTitle'} defaultMessage={'Products'} />;
    const descriptionTitle = <FormattedMessage id={'descriptionTitle'} defaultMessage={'Description'} />;
    const pricesTitle = <FormattedMessage id={'pricesTitle'} defaultMessage={'Prices'} />;

    const handleTooglePrice = () => {
        setTooglePrice(!tooglePrice);
    };

    const editPriceButton = (
        <Button priority={'high'} onClick={handleTooglePrice}>
            <FormattedMessage id={'editPdfButton'} defaultMessage={'Edit'} />
        </Button>
    );

    const cancelButton = (
        <Button priority={'low'} onClick={handleClosePopup}>
            <FormattedMessage id={'cancelPdfButton'} defaultMessage={'Cancel'} />
        </Button>
    );
    const printButton = (
        <Button priority={'high'} onClick={handlePrint}>
            <FormattedMessage id={'printTitle'} defaultMessage={'Print'} />
        </Button>
    );
    const doneButton = (
        <Button priority={'high'} onClick={handleTooglePrice}>
            <FormattedMessage id={'donePdfButton'} defaultMessage={'Done'} />
        </Button>
    );

    const printTitle = <FormattedMessage id={'printTitle'} defaultMessage={'Print'} />;

    return (
        <CustomDialog
            confirmTranslationId={'global.close'}
            confirmText="Print"
            isOpen={openPopup}
            onCancel={handleClosePopup}
            shouldShowButtons={false}
            title={printTitle}
            isModal={true}
            shouldHideCancelButton={true}
        >
            <Dropzone />
            <main ref={ref}>
                <section className={defaultClasses.companyData}>
                    <article className={defaultClasses.imagesContainer}>
                        <ImagesList />
                    </article>
                    <article className={defaultClasses.containerCompanyInfo}>
                        <textarea
                            name="info"
                            id=""
                            cols="30"
                            rows="10"
                            value={companyInfo}
                            onChange={e => {
                                setCompanyInfo(e.target.value);
                            }}
                        />
                    </article>

                    <article className={defaultClasses.emptyContainer}>
                        <article />
                    </article>
                </section>
                <section className={defaultClasses.titlesContainer}>
                    <article className={defaultClasses.titleProduct}>
                        <p>{productTitle}</p>
                    </article>
                    <article className={defaultClasses.titleDescription}>
                        <p>{descriptionTitle}</p>
                    </article>
                    <article className={defaultClasses.titlePrice}>
                        <p>{pricesTitle}</p>
                    </article>
                </section>

                {cartItem && (
                    <div className={defaultClasses.cartItemContainer}>
                        {cartItem.map(item => {
                            return <ItemCard key={item.id} item={item} tooglePrice={tooglePrice} />;
                        })}
                    </div>
                )}
                {priceSummary ? (
                    <ItemSummaryCard
                        tooglePrice={tooglePrice}
                        priceSummary={priceSummary}
                        editPriceButton={editPriceButton}
                    />
                ) : null}
            </main>
            <section className={defaultClasses.buttonsContainer}>
                {tooglePrice ? (
                    <article className={defaultClasses.individualButton}>{doneButton}</article>
                ) : (
                    <article className={defaultClasses.individualButton}>{editPriceButton}</article>
                )}

                <article className={defaultClasses.individualButton}>{cancelButton}</article>

                <article className={defaultClasses.individualButton}>{printButton}</article>
            </section>
        </CustomDialog>
    );
});

export default PrintPdfPopup;
