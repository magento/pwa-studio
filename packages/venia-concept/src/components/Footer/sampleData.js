import { ContactLink } from '@magento/venia-ui/lib/components/ContactPage';

const accountLinks = new Map()
    .set('How to buy', null)
    .set('Payment methods', null)
    .set('Order and pick up', null)
    .set('Order with delivery', null)
    .set('Shopping over the phone', null)
    .set('Returns', null);

const helpLinks = new Map()
    .set('Help', null)
    .set('Contact', {
        path: '/contact-us',
        Component: ContactLink
    })
    .set('Online Help', null)
    .set('Our Commitments', null)
    .set('Give feedback', null);

const servicesLinks = new Map()
    .set('Services', null)
    .set('Transport', null)
    .set('Design service', null)
    .set('Paint an plaster mixing service', null)
    .set('Dimensioning and assemly service', null)
    .set('Return of used equipment', null)
    .set('Additional services', null);

const aboutLinks = new Map()
    .set('About us', null)
    .set('Press Office', null)
    .set('For suppliers', null)
    .set('Regulations', null)
    .set('Privacy Policy', null)
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
