import { ContactLink } from '../ContactPage';

const accountLinks = new Map()
    .set('How to buy', '/howtoorder')
    .set('Payment methods', '/paymentmethods')
    .set('Order and pick up', null)
    .set('Order with delivery', null)
    .set('Shopping over the phone', null)
    .set('Returns', null)
    .set('Mobile Experience', '/mobileexperience');

const helpLinks = new Map()
    .set('Help', null)
    .set('Contact', {
        path: '/contact-us',
        Component: ContactLink
    })
    .set('Online Help', null)
    .set('Our Commitments', null)
    .set('Give feedback', 'givefeedback');

const servicesLinks = new Map()
    .set('Services', null)
    .set('Transport', null)
    .set('Design service', null)
    .set('Paint an plaster mixing service', null)
    .set('Dimensioning and assemly service', null)
    .set('Return of used equipment', null)
    .set('Additional services', null);

const aboutLinks = new Map()
    .set('About us', 'company')
    .set('Press Office', null)
    .set('For suppliers', null)
    .set('Regulations', null)
    .set('Privacy Policy', 'privacypolicy')
    .set('Cookies', null)
    .set('Personal Data Request', null);

export const DEFAULT_LINKS = new Map()
    .set('account', accountLinks)
    .set('help', helpLinks)
    .set('services', servicesLinks)
    .set('about', aboutLinks);

//CUSTOM DATA

export const sedeOperaciones = {
    title: 'Company title',
    address1: 'Address1',
    address2: 'Address2',
    country: 'Country',
    tel: 'Phone'
};

export const sedeFinanciera = {
    title: 'Company title',
    address1: 'Address1',
    address2: 'Address2',
    country: 'Country',
    tel: 'Phone'
};

export const PHONE = 'Phone';

export const MAIL = 'mail@mail.com';

export const LOREM_IPSUM =
    'Lorem ipsum dolor sit amet, consectetur adipsicing elit, sed do eiusmod tempor incididunt ut labore et dolore.';
