const path = require('path');
const { AsyncParallelHook } = require('tapable');
const HookInterceptorSet = require('../HookInterceptorSet');
const targetSerializer = require('../JestPeregrineTargetSerializer');

expect.addSnapshotSerializer(targetSerializer);

// Since fast-glob doesn't return in reliable order (it sacrifices that for
// speed), we sort the results so the snapshot stays deterministic. Don't
// need to do this in runtime!
const sortByFilename = (a, b) =>
    (a._talonModule.file > b._talonModule.file && 1) ||
    (b._talonModule.file > a._talonModule.file && -1) ||
    0;

const serializeTransforms = interceptorSet => {
    return [...interceptorSet.allModules]
        .sort(sortByFilename)
        .filter(mod => mod._talonModule._queuedTransforms.length > 0)
        .map(mod =>
            mod._talonModule._queuedTransforms
                .map(
                    ({ options }) =>
                        `${options.wrapperModule}(${options.exportName})`
                )
                .join('\n')
        );
};

describe('HookInterceptorSet for talons target API', () => {
    let talonInterceptors;
    const talonTarget = new AsyncParallelHook(['wrappers']);
    beforeAll(async () => {
        talonInterceptors = new HookInterceptorSet(
            path.resolve(__dirname, '../../talons/'),
            talonTarget
        );
        await talonInterceptors.populate();
    });
    test('stores a queue of transform requests for talon files', async () => {
        talonTarget.tap('unittests', talons => {
            talons.Accordion.useAccordion.wrapWith('metal');
            talons.AccountChip.useAccountChip.wrapWith('dust');
            talons.AccountMenu.useAccountMenuItems.wrapWith('drapes');
            talons.App.useApp.wrapWith('bunting');
            talons.AuthBar.useAuthBar.wrapWith('lace');
            talons.AuthModal.useAuthModal.wrapWith('muslin');
            talons.Breadcrumbs.useBreadcrumbs.wrapWith('egg');
            talons.CartPage.useCartPage.wrapWith('silk');
            talons.CartPage.GiftCards.useGiftCard.wrapWith('envelope');
            talons.CartPage.GiftCards.useGiftCards.wrapWith('ribbons');
        });

        await talonInterceptors.runAll();

        expect(serializeTransforms(talonInterceptors)).toMatchSnapshot();
    });
});

describe('HookInterceptorSet for hooks target API', () => {
    let hookInterceptors;
    const hookTarget = new AsyncParallelHook(['wrappers']);
    beforeAll(async () => {
        hookInterceptors = new HookInterceptorSet(
            path.resolve(__dirname, '../../hooks/'),
            hookTarget
        );
        // do not run populate this time, to test that .runAll will run it
    });
    test('stores a queue of transform requests for hook files', async () => {
        hookTarget.tapPromise('unittests', async hooks => {
            hooks.useAwaitQuery.wrapWith('frosting');
            hooks.useCarousel.wrapWith('wd-40');
            hooks.useDropdown.wrapWith('curtains');
            hooks.useEventListener.wrapWith('fanfare');
            hooks.usePagination.wrapWith('knickknacks');
            hooks.useResetForm.wrapWith('unsettery');
            hooks.useRestApi.wrapWith('en passant');
            hooks.useRestResponse.wrapWith('indolence');
            hooks.useScrollIntoView.wrapWith('physics');
            hooks.useScrollLock.wrapWith('crisis');
            hooks.useScrollTopOnChange.wrapWith('mutability');
            hooks.useSearchParam.wrapWith('optimism');
            hooks.useSort.wrapWith('intent');
            hooks.useWindowSize.wrapWith('disbelief');
        });

        await hookInterceptors.runAll();

        expect(serializeTransforms(hookInterceptors)).toMatchSnapshot();
    });
});
