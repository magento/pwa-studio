import React, { Component } from 'react';

import './home.css';

class Home extends Component {
    render() {
        return (
            <article className="Home">
                <h1 className="Home-title">
                    <span>Venia</span>
                </h1>
                <section className="Home-hero">
                    <h2 className="Home-hero-title">
                        <span>&lsquo;Fall&rsquo; In Love With</span>
                        <br />
                        <span>Pieces Inspired By Paris</span>
                    </h2>
                    <div className="Home-hero-actions">
                        <a
                            className="Home-hero-actions-action"
                            href="outerwear"
                        >
                            <span>Shop Outerwear</span>
                        </a>
                    </div>
                </section>
                <section className="Home-saleBanner">
                    <p className="Home-saleBanner-copy">
                        <span>Sale on all shoes this weekend!</span>
                    </p>
                    <p className="Home-saleBanner-copy">
                        <span>Use promo code HAPPYFEET</span>
                    </p>
                </section>
                <section className="Home-storySection">
                    <h2 className="Home-storySection-title">
                        <span>Our Story</span>
                    </h2>
                    <div className="Home-storySection-image" />
                    <div className="Home-storySection-content">
                        <p className="Home-storySection-content-copy">
                            <span>
                                Style is personal. Realizing this wasn't what
                                most brands were sensitive to, we built a
                                lifestyle brand that caters to creative,
                                sensitive, strong women.
                            </span>
                        </p>
                        <p className="Home-storySection-content-copy">
                            <span>
                                Venia opened its very first doors in the autumn
                                of 1992 in Lima, Peru. We now operate over 200
                                stores worldwide.
                            </span>
                        </p>
                        <div className="Home-storySection-content-actions">
                            <a
                                className="Home-storySection-content-actions-action"
                                href="read-more"
                            >
                                <span>Read More</span>
                            </a>
                        </div>
                    </div>
                </section>
            </article>
        );
    }
}

export default Home;
