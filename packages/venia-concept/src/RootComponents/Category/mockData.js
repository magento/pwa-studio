import * as images from './images';

const data = [
    {
        key: '001',
        name: 'Petra Sundress',
        price: '$108'
    },
    {
        key: '002',
        name: 'Athena Tank Dress',
        price: '$128'
    },
    {
        key: '003',
        name: 'Claudia Crochet Dress',
        price: '$98'
    },
    {
        key: '004',
        name: 'Alexia Maxi Dress',
        price: '$78'
    },
    {
        key: '005',
        name: 'Valentina Tank Dress',
        price: '$78'
    },
    {
        key: '006',
        name: 'Paulina Draped Tank Dress',
        price: '$108'
    },
    {
        key: '007',
        name: 'Flora Tank Dress',
        price: '$148'
    },
    {
        key: '008',
        name: 'Veronica Maxi Dress',
        price: '$88'
    },
    {
        key: '009',
        name: 'Felicia Maxi Dress',
        price: '$128'
    },
    {
        key: '010',
        name: 'Karena Halter Dress',
        price: '$78'
    },
    {
        key: '011',
        name: 'Candace Dress',
        price: '$108'
    },
    {
        key: '012',
        name: 'Angelina Tank Dress',
        price: '$98'
    }
].map(model => ({ ...model, image: images[`image${model.key}`] }));

export default data;
