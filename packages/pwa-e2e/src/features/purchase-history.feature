Feature: Purchase History

  Scenario: History List
    Given Authorized User with Purchasing
    When User navigate to "Main Menu"
    And "Main Menu" component is presented
    Then User click by "expanded" button
    And "Purchase History" button is presented
    And User click by "Purchase History" button
    And "Purchase History" component is presented
