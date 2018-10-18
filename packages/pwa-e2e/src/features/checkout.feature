Feature: Checkout

  Scenario: Ship To Order Confirmation
    Given Product in a cart
    When User click by "checkout" button
    Then User click by "Ship by" button
    And User fill "SHIPPING ADDRESS" form
    And "orderId" is presented
    And "Continue Shopping" button is presented

  Scenario: Pay with Order Confirmation
    Given Product in a cart
    When User click by "checkout" button
    Then User click by "Pay with" button
    And User fill "SHIPPING ADDRESS" form
    And "orderId" is presented
    And "Continue Shopping" button is presented

  Scenario: Get It By Order Confirmation
    Given Product in a cart
    When User click by "checkout" button
    Then User click by "Get It By" button
    And User fill "SHIPPING ADDRESS" form
    And "orderId" is presented
    And "Continue Shopping" button is presented