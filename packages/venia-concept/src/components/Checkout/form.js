import { Component, createElement } from 'react';
import { bool, func, shape, string } from 'prop-types';

import classify from 'src/classify';
import Section from './section';
import SubmitButton from './submitButton';
import defaultClasses from './form.css';
import Selector from 'src/components/Selector';

class Form extends Component {
    constructor(props) {
      super(props);
      this.state = {
        updatePayment: false,
        updateShipping: false,
      }
    }

    static propTypes = {
        classes: shape({
            body: string,
            footer: string,
            root: string
        }),
        ready: bool,
        status: string.isRequired,
        submitOrder: func.isRequired
    };

    get paymentMethodSelector() {
      const { classes } = this.props;
      const { paymentMethod, availablePaymentMethods } = this.props;

        return !!this.state.updatePayment ? (
              <Selector
                options={availablePaymentMethods}
                selectedOption={paymentMethod}
                handleSelection={(code) => this.modifyPaymentMethod(code)}
              >
              </Selector>
        ) : null;
    }

    get shippingMethodSelector() {
      const { classes } = this.props;
      const { shippingMethod, availableShippingMethods } = this.props;

      return !!this.state.updateShipping ? (
          <Selector
            options={availableShippingMethods}
            selectedOption={shippingMethod}
            handleSelection={(code) => this.modifyShippingMethod(code)}
          >
          </Selector>
      ) : null;
    }

    get cartOptions() {
      const { classes } = this.props;
      const { paymentMethod, shippingMethod, availableShippingMethods, isShippingInformationReady } = this.props;

      const shipToText = this.isShippingInformationReady ? 'Complete' : 'Click to fill out';
      const paymentMethodText = paymentMethod ? paymentMethod : 'No payment methods available';
      let shippingMethodtext = !!availableShippingMethods ? 'Click to fill out' : 'Enter Ship To address';
      shippingMethodtext = ( isShippingInformationReady && !availableShippingMethods ) ? 'Loading shipping methods...' : shippingMethodtext;
      shippingMethodtext = ( !!shippingMethod && !!shippingMethodtext) ? shippingMethod : shippingMethodtext;

      return !this.state.updatePayment && !this.state.updateShipping ? (
          <div className={classes.body}>
              <Section
                  label="Ship To"
                  onClick={this.showShippingAddressSelector}
              >
                  <span>{shipToText}</span>
              </Section>
              <Section
                  label="Pay With"
                  onClick={this.showPaymentMethodSelector}
              >
                  <span>{paymentMethodText}</span>
              </Section>
              <Section
                  disabled={!availableShippingMethods}
                  label="Get It By"
                  onClick={this.showShippingMethodSelector}
              >
                  <span>{shippingMethodtext}</span>
              </Section>
          </div>
        ) : null;
    }

    render() {
      const {
        classes,
        ready,
        status,
        submitOrder,
      } = this.props;

      const { shippingMethodSelector, paymentMethodSelector, cartOptions } = this;

      return (
        <div className={classes.root}>
          {shippingMethodSelector}
          {paymentMethodSelector}
          {cartOptions}
          <div className={classes.footer}>
              <SubmitButton
                  ready={ready}
                  status={status}
                  submitOrder={submitOrder}
              />
          </div>
        </div>
      )
    }

    componentDidMount() {
      // Set default payment method
      this.setDefaultOrderMethod(this.props.availablePaymentMethods, this.modifyPaymentMethod);
    }

    setDefaultOrderMethod = (orderMethodsAvailable, callback) => {
      if ( !!orderMethodsAvailable && !!orderMethodsAvailable[0] ) { callback(orderMethodsAvailable[0]) };
    }

    modifyPaymentMethod = (paymentMethod) => {
      this.props.enterSubflow('SUBMIT_PAYMENT_INFORMATION', paymentMethod)
      this.setState({
        updatePayment: false
      })
    };

    showShippingAddressSelector = () => {
       this.props.submitMockShippingAddress().then(() => {
         this.props.getShippingMethods().then(() => {
           // Set default shipping method
           this.setDefaultOrderMethod(this.props.availableShippingMethods, this.modifyShippingMethod);
         })
       });
    };

    modifyShippingMethod = (shippingMethod) => {
        this.props.enterSubflow('SUBMIT_SHIPPING_METHOD', shippingMethod);
        this.setState({
          updateShipping: false
        })
    };

    showPaymentMethodSelector = () => {
      this.setState({
        updatePayment: true
      })
    }

    showShippingMethodSelector = () => {
      this.setState({
        updateShipping: true
      })
    }
}

export default classify(defaultClasses)(Form);
