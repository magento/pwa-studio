export const getButtonGroupItems = (
    buyAgainHandler,
    shareItemHandler,
    reviewItemHandler
) => [
    {
        onClickHandler: buyAgainHandler,
        iconName: 'shopping-cart',
        textNode: 'Buy Again'
    },
    {
        onClickHandler: shareItemHandler,
        iconName: 'share-2',
        textNode: 'Share Item'
    },
    {
        onClickHandler: reviewItemHandler,
        iconName: 'message-square',
        textNode: 'Review Item'
    }
];
