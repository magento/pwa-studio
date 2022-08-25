import { ContactLink } from '../ContactPage';

const accountLinks = new Map()
    .set('Account', null)
    .set('Sign In', null)
    .set('Register', null)
    .set('Order Status', null)
    .set('Returns', null);

const aboutLinks = new Map()
    .set('About Us', '/about-us')
    .set('Our Story', null)
    .set('Email Signup', null)
    .set('Give Back', null);

const helpLinks = new Map()
    .set('Help', null)
    .set('Customer Service', '/customer-service')
    .set('Contact Us', {
        path: '/contact-us',
        Component: ContactLink
    })
    .set('Order Status', null)
    .set('Returns', null);

export const DEFAULT_LINKS = new Map()
    .set('account', accountLinks)
    .set('about', aboutLinks)
    .set('help', helpLinks);

export const LOREM_IPSUM =
    'Lorem ipsum dolor sit amet, consectetur adipsicing elit, sed do eiusmod tempor incididunt ut labore et dolore.';
