# Feature: Authorization

#     Scenario: Sign In
#         Given Anonimous User
#         When User on "home" page
#         And User click by "burger" button
#         And User click by "sign in" button
#         Then User presented "SIGN IN" form
#         And User fill "Email" field
#         And User fill "password" field
#         And User submit "sign in" form
#         And User see email on the buttom

#     Scenario: Sign Up
#         Given Anonimous User
#         When User on "home" page
#         And User click by "burger" button
#         And User click by "sign in" button
#         Then User presented "SIGN IN" form
#         And User click by "Create an Account" button
#         Then User presented "CREATE ACCOUNT" form
#         And User fill "First name" field
#         And User fill "Last name" field
#         And User fill "Email" field
#         And User fill "Password" field
#         And User fill "Confirm Password" field
#         And User submit "sign up" form

#     Scenario: Forgot Password
#         Given Anonimous User
#         When User click by "sign in" button
#         Then User presented "SIGN IN" form
#         And User click by "Forgot your username or password?" button
#         And User fill "Email address" field
#         And User submit "forgot password" form
#         And User click by "Continue shopping" button

#     Scenario Outline: Many users signing in
#         Given Anonimous User
#         When User click by "sign in/sign up" button
#         Then Side menu is visible
#         And User presented authorization form
#         And User submit authorization form with <Username> and <Password>
#         And User see email on the topbar

#         Examples:
#             | Id | Username | Password       |
#             | 1  | user1    | user1_password |
#             | 2  | user2    | user2_password |
#             | 3  | user3    | user3_password |
