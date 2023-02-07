# B2BStore 0.7.1

## 🚨 Hotfixes    
  - Added missing working_dir line in the docker-compose file.
  - Update Chatbot’s script hash in Upward.
  - Update README file.

# B2BStore 0.7

## 🌟 New features

  - Extra order’s attributes (External order number and Comment).
  - Delivery Date, Delivery Time and Delivery Comment fields added to the checkout process.
  - Now it’s possible to use an icon as a category (instead showing the category name).

## 🪄 Enhancements
  - The delivery date options in the checkout process is now a expandable block.
  - LMS is now connected with Moodle using the Moodle-gateway.
  - Move Quick Order and compare products icons from megamenu to side menu in mobile styles.
  - Added compatibility for the “Completed” quote status.
  - Replace react-drag-drop-files by react-dropzone.
  - Update the emoji picker library to the last version and make it compatible with B2BStore.
  - Refactor dialog format and unify the use in B2BStore.
  - Remove unused components.
  - We have started to use tippy.js for the tooltips used in the PLP.
  - Refactor "Download catalog as CSV" feature.
  - Set a limit for the username size to avoid showing too long names.

## 🛠 Bug fixes
  - Remove lastname field in the order history page.
  - Don’t allow to resize the text area in the print pdf dialog.
  - Fix product image overflow in the PDP.
  - Fixed the iPad megamenu layout.
  - Fixed an issue that caused the user to be unable to finish the checkout process when his billing address was incorrect.
  - Fixed an UI issue that made the button to accept the cookies unclickable in some devices.
  - Fixed an issue that caused the “Reorder” button to not work properly.
  - Fixed an UI issue that caused the Quick Order button to be displayed also in the mega menu in mobile devices.
  - Fixed "Invalid date" message in iPhone 13 (Safari)
  - Quick order form, Do not allow to download the sample file if no products are added.
  - Fixed course slider error when the user is not signed in on the home page.
  - Fixed add to cart button has not the disabled style when the product is Out of stock.
  - B2B PDP, Fixed an issue when loading a simple product that has no image.
  - Checkout, Fix Credit System credits information UI on low resolutions.
  - Fixed an issue with the reorder button that was throwing an exception after being used multiple times without refreshing.
  - Fix an issue that caused the categories not being visible in iPad Pro.
  - Fix offer's statuses translations.
  - Fix issues in compare product page UI.
  - Custom inputs styles not working in Safari.
  - Order History page, Product's attributes now are shown correctly.
  - Add to cart button in B2B PDP were not being temporally disabled while adding a product to the cart after being clicked.
  - Order's attributes and delivery date's attributes were not showing in Order history page.
  - Fixed an issue that caused the SKU selection list not being affected by filters in the PLP.
  - Print PDF drag & drop doesn't seem to work (it gives no feedback for the uploaded image).
  - Fix issues in B2C PDP UI in Safari.
  - Fixed “Url_suffix is undefined” issue.
  - Some discounts were taking too much time before showing in PLP and PDP pages.
  - Main menu in mobile were is now showing correctly in Safari.
  - Fix multiple issues in PDP mobile UI.
  - Fix issues in Order history page UI between 1201px and ~1300px.
  - Now the subcategories section doesn’t overlap the search results.
  - Fix multiple UI issues in tablets devices.
  - Redirect from /sign-in to the homepage if the user is already logged in.
  - Some categories in the side menu were being cut (mobile mode).