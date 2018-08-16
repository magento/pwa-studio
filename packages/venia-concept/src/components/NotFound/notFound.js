import { Component, createElement } from 'react';
import { Link } from 'react-router-dom';
import Page from 'src/components/Page';
import logo from 'src/components/Header/logo.svg';
import defaultClasses from './notFound.css'
import classify from 'src/classify';
import PropTypes from 'prop-types';
import Icon from 'src/components/Icon';

class NotFound extends Component {

  static propTypes = {
      classes: PropTypes.shape({
          NotFound: PropTypes.string,
          NotFoundTitle: PropTypes.string,
          NotFoundLogo: PropTypes.string,
          NotFoundContent: PropTypes.string,
          NotFoundActions: PropTypes.string,
          NotFoundActionsAction: PropTypes.string
      })
  };

    render() {

      const { classes } = this.props;


        return (
            <Page>
              <article className={classes.NotFound}>
                  <h1 className={classes.NotFoundTitle}>
                      <div>4<img className={classes.NotFoundLogo} src={logo} alt="Venia" title="Venia" />4</div>
                      <div>Page Not Found</div>
                  </h1>
                  <section className={classes.NotFoundContent}>
                      <p>
                          <span className={classes.NotFoundActions}>
                              <span>We could not find the page you were trying to get to.</span>
                              <Link
                                  className={classes.NotFoundActionsAction}
                                  to="/cart"
                              > View your cart </Link>
                               <span>or</span>
                               <Link
                                  className={classes.NotFoundActionsAction}
                                  to="/home"
                              > go home
                              </Link>
                              <span> to get back on track.</span>
                          </span>
                      </p>
                  </section>
              </article>
            </Page>
        );
    }
}

export default classify(defaultClasses)(NotFound);
