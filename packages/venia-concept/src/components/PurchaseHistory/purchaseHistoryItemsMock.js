import dressImage from './dress.jpg';

const mockPurchaseHistory = [
    {
        id: 1,
        imageSrc: dressImage,
        title: 'Lorem ipsum dolor sit amet',
        date: new Date(2018, 3, 20),
        link: '/'
    },
    {
        id: 2,
        imageSrc: dressImage,
        title: 'Duis aute irure dolor in reprehenderit in voluptate',
        date: new Date(2017, 2, 12),
        link: '/'
    },
    {
        id: 3,
        imageSrc: dressImage,
        title: 'Ut enim ad minima',
        date: new Date(2016, 1, 1),
        link: '/'
    },
    {
        id: 4,
        imageSrc: dressImage,
        title: 'Quis autem vel',
        date: new Date(),
        link: '/'
    }
];

export default mockPurchaseHistory;
