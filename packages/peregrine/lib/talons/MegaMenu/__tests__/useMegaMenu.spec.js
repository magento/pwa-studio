import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useQuery } from '@apollo/client';

import createTestInstance from '../../../util/createTestInstance';
import { useMegaMenu } from '../useMegaMenu';
import { useEventListener } from '../../../hooks/useEventListener';

jest.mock('@apollo/client');
jest.mock('react-router-dom', () => ({
    useLocation: jest.fn(() => ({ pathname: '/venia-tops.html' }))
}));

jest.mock('../../../hooks/useInternalLink', () =>
    jest.fn(() => ({
        setShimmerType: jest.fn().mockName('onNavigate')
    }))
);

jest.mock('../../../hooks/useEventListener', () => ({
    useEventListener: jest.fn()
}));

const log = jest.fn();

const Component = props => {
    const talonProps = useMegaMenu({ ...props });

    useEffect(() => {
        log(talonProps);
    }, [talonProps]);

    return <i talonProps={talonProps} />;
};

const getTalonProps = props => {
    const tree = createTestInstance(<Component {...props} />);
    const { root } = tree;
    const { talonProps } = root.findByType('i').props;

    const update = newProps => {
        tree.update(<Component {...{ ...props, ...newProps }} />);

        return root.findByType('i').props.talonProps;
    };

    return { talonProps, tree, update };
};

beforeAll(() => {
    useQuery.mockReturnValue({
        data: {
            categoryList: [
                {
                    uid: 'Mg==',
                    name: 'Default Category',
                    children: [
                        {
                            uid: 'MTE=',
                            include_in_menu: 1,
                            name: 'Accessories',
                            position: 4,
                            url_path: 'venia-accessories',
                            children: [
                                {
                                    uid: 'NA==',
                                    include_in_menu: 1,
                                    name: 'Belts',
                                    position: 10,
                                    url_path: 'venia-accessories/venia-belts',
                                    children: []
                                },
                                {
                                    uid: 'NQ==',
                                    include_in_menu: 1,
                                    name: 'Jewelry',
                                    position: 2,
                                    url_path: 'venia-accessories/venia-jewelry',
                                    children: []
                                },
                                {
                                    uid: 'Ng==',
                                    include_in_menu: 0,
                                    name: 'Scarves',
                                    position: 3,
                                    url_path: 'venia-accessories/venia-scarves',
                                    children: []
                                }
                            ]
                        },
                        {
                            uid: 'OA==',
                            include_in_menu: 1,
                            name: 'Tops',
                            position: 3,
                            url_path: 'venia-tops',
                            children: [
                                {
                                    uid: 'OQ==',
                                    include_in_menu: 1,
                                    name: 'Blouses & Shirts',
                                    position: 1,
                                    url_path: 'venia-tops/venia-blouses',
                                    children: []
                                },
                                {
                                    uid: 'MTA=',
                                    include_in_menu: 1,
                                    name: 'Sweaters',
                                    position: 2,
                                    url_path: 'venia-tops/venia-sweaters',
                                    children: []
                                }
                            ]
                        },
                        {
                            uid: 'MTQ=',
                            include_in_menu: 0,
                            name: 'Dresses',
                            position: 3,
                            url_path: 'venia-dresses',
                            children: []
                        }
                    ]
                }
            ],
            storeConfig: {
                store_code: 'default',
                category_url_suffix: '.html'
            }
        }
    });
});

test('Should render proper shape', () => {
    const { talonProps } = getTalonProps();

    expect(talonProps).toMatchSnapshot();
});

test('Should set active category', () => {
    useLocation.mockReturnValue({
        pathname: '/venia-accessories/venia-belts.html'
    });

    const { talonProps } = getTalonProps();
    /**
     * Child category "Belts" is active and it root category should be mark as active
     * Parent for Belts has uid MTE= (Accessories)
     */
    expect(talonProps.activeCategoryId).toEqual('MTE=');
});

test('Should clear active category', () => {
    useLocation.mockReturnValue({ pathname: '/' });

    const { talonProps } = getTalonProps();
    /**
     * Child category "Belts" is active and it root category should be mark as active
     * Parent for Belts has id 3 (Accessories)
     */
    expect(talonProps.activeCategoryId).toBeNull();
});

test('Should sort items', () => {
    const { talonProps } = getTalonProps();

    /**
     * In mocked data:
     * the Accessories category has position equals 4
     * the Tops category has position equals 3
     * so Tops category should be the first one in the megaMenuData object
     *
     */
    expect(talonProps.megaMenuData.children[0].name).toEqual('Tops');

    /**
     * In mocked data:
     * the Belts category has position equals 10
     * the Jewelry category has position equals 2
     * so Jewelry category should be the first one in the parent category object
     *
     */
    expect(talonProps.megaMenuData.children[1].children[0].name).toEqual(
        'Jewelry'
    );
});

test('Should not render items that are not included in menu', () => {
    const { talonProps } = getTalonProps();

    /**
     * In mocked data:
     * there are 3 top level categories
     * The last one has set up field include_in_menu to 0
     * so the megaMenuData object should have only two top level categories
     */
    expect(talonProps.megaMenuData.children.length).toEqual(2);

    /**
     * In mocked data:
     * there are 3 categories in Accessories category
     * The last one has set up field include_in_menu to 0
     * so the Accessories category  object should have only two top level categories
     */
    expect(talonProps.megaMenuData.children[1].children.length).toEqual(2);
});

test('Should add eventListner for keydown, mouseout, mousedown', () => {
    createTestInstance(<Component />);

    expect(useEventListener.mock.calls).toMatchSnapshot();
});

test('handleClickOutside should setSubMenuState to false and setDisableFocus to true', () => {
    const { update } = getTalonProps({
        mainNavRef: { current: { contains: () => false } }
    });

    const handleClickOutside = useEventListener.mock.calls[0][2];

    handleClickOutside({ target: 'test' });
    const talonProps = update();
    expect(talonProps.subMenuState).toBeFalsy();
    expect(talonProps.disableFocus).toBeTruthy();
});

test('handleSubMenuFocus should setSubMenuState to true', () => {
    const setSubMenuState = jest.fn(() => true);

    const { update } = getTalonProps({
        setSubMenuState
    });
    const talonProps = update();
    const handleSubMenuFocus = talonProps.handleSubMenuFocus();

    expect(handleSubMenuFocus).toMatchSnapshot();
});
