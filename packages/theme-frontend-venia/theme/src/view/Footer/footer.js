import { Component, createElement } from 'react';

import './footer.css';

class Footer extends Component {
    render() {
        return (
            <footer className="Footer">
                <div className="Footer-tile--account">
                    <h2>
                        <span>Your Account</span>
                    </h2>
                    <p>
                        <span>
                            Sign up and get access to our wonderful rewards
                            program.
                        </span>
                    </p>
                </div>
                <div className="Footer-tile--instagram">
                    <h2>
                        <span>Follow Us On Instagram</span>
                    </h2>
                    <p>
                        <span>
                            See what the Rush Tribe is up to, and add your
                            stories to the mix.
                        </span>
                    </p>
                </div>
                <div className="Footer-tile--locator">
                    <h2>
                        <span>Store Locator</span>
                    </h2>
                    <p>
                        <span>
                            Find the one closest to you from over 1200 locations
                            worldwide.
                        </span>
                    </p>
                </div>
                <div className="Footer-tile--support">
                    <h2>
                        <span>Customer Support</span>
                    </h2>
                    <p>
                        <span>Call us, chat, email us, FAQs and more.</span>
                    </p>
                </div>
            </footer>
        );
    }
}

export default Footer;
