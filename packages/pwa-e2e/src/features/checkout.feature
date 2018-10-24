Feature: Checkout

  Scenario: checkout without order details
    Given Anonimous User
    When User click by "Accessories" button
    Then "accessories" list is presented
    And User click by "Carmina Earrings" button
    And User click by "Add to cart" button
    And User click by "Checkout" button
    And User click by "Ship to" button
    And "SHIPPING ADDRESS" form is presented
    And User fill "SHIPPING ADDRESS" form
    And User click by "Save" button
