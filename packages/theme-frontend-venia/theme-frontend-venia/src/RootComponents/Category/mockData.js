const data = [
    {
        image: 'img/products/small/V/D/VD12-RN_main2.jpg',
        name: 'Petra Sundress',
        price: '$108'
    },
    {
        image: 'img/products/small/V/D/VD11-LY_main2.jpg',
        name: 'Athena Tank Dress',
        price: '$128'
    },
    {
        image: 'img/products/small/V/D/VD10-LY_main2.jpg',
        name: 'Claudia Crochet Dress',
        price: '$98'
    },
    {
        image: 'img/products/small/V/D/VD09-PE_main2.jpg',
        name: 'Alexia Maxi Dress',
        price: '$78'
    },
    {
        image: 'img/products/small/V/D/VD08-LL_main2.jpg',
        name: 'Valentina Tank Dress',
        price: '$78'
    },
    {
        image: 'img/products/small/V/D/VD07-PE_main.jpg',
        name: 'Paulina Draped Tank Dress',
        price: '$108'
    },
    {
        image: 'img/products/small/V/D/VD06-MT_main.jpg',
        name: 'Flora Tank Dress',
        price: '$148'
    },
    {
        image: 'img/products/small/V/D/VD05-LY_main2.jpg',
        name: 'Veronica Maxi Dress',
        price: '$88'
    },
    {
        image: 'img/products/small/V/D/VD04-PE_main.jpg',
        name: 'Felicia Maxi Dress',
        price: '$128'
    },
    {
        image: 'img/products/small/V/D/VD03-MT_main.jpg',
        name: 'Karena Halter Dress',
        price: '$78'
    },
    {
        image: 'img/products/small/V/D/VD02-LL_main2.jpg',
        name: 'Candace Dress',
        price: '$108'
    },
    {
        image: 'img/products/small/V/D/VD01-LL_main2.jpg',
        name: 'Angelina Tank Dress',
        price: '$98'
    }
].map((model, index) => ({
    ...model,
    image: `https://magento-ux.github.io/pwaza/${model.image}`,
    key: `product${index.toString().padStart(3, '0')}`
}));

export default data;
