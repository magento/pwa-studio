import React, { Component } from 'react';
import { Link } from 'src/drivers';

import './notFound.css';

class NotFound extends Component {
    render() {
        return (
            <article className="NotFound">
                <h1 className="NotFound-title">
                    <span>404 Error!</span>
                </h1>
                <section className="NotFound-hero">
                    <h2 className="NotFound-hero-title">
                        <span>We&rsquo;re Sorry!</span>
                    </h2>
                </section>
                <section className="NotFound-content">
                    <p>
                        <span>
                            We could not find the page you were trying to get
                            to. Here are some suggestions to help you get back
                            on track.
                        </span>
                    </p>
                    <div className="NotFound-content-actions">
                        <Link
                            className="NotFound-content-actions-action"
                            to="/cart"
                        >
                            <span>Your Cart</span>
                        </Link>
                        <Link
                            className="NotFound-content-actions-action"
                            to="/history"
                        >
                            <span>Recently Viewed</span>
                        </Link>
                    </div>
                </section>
            </article>
        );
    }
}

export default NotFound;
