# Now

## What is Now?

`Now.sh` or `ZEIT Now` is an easy way to deploy our Venia reference storefront to the web.

Their homepage is https://zeit.co/home.

## How does Now work?

We have a `Magento` team in `Now` that is integrated with GitHub using `Now for GitHub`.
Using this integration, `Now` will deploy our app every time we push code to our `magento/pwa-studio` repository on GitHub.

## How is Now configured?

Recently `Now` updated to a "zero configuration" model.
`Now` will run the `build` script (in `package.json`) and expects the app to appear in a `public` directory after the build is complete.

`Now` will then publish the contents of the `public` directory on deployment.


