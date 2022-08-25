import globalCSS from './homePage.module.css';

// `MagentoRoute` renders the CMS page, so this component renders nothing.
// This file would be obsolete if the CMS could deliver a stylesheet.
const HomePage = () => null;

export default HomePage;

// Use the import to make webpack inject a stylesheet.
HomePage.globalCSS = globalCSS;
