Feature: Home

  Scenario Outline: Scolling Content with
    Given Anonumous User with <wifi state>
    When User wifi state is <wifi state>
    Then User scoll content
    And Content is presented

    Examples:
      | wifi state |
      | on         |
      | off        |
      | slow-3g    |