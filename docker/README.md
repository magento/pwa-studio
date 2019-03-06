# Docker Directory

This directory stores certificates for local SSL/TLS, created by running `run-docker` script, as well as configuration for docker environment setup.

Run the `docker/run-docker` script from the root of the repository to create a container running PWA with a secure https protocol.

This script will:

* copy the `.env.docker` environment variables to `.env` to be easily consumable by `docker-compose`
* add a custom domain, configured in `.env.docker`
* generate a self-signed ssl/tls certificate and trust the certificate using `devcert` in the `makeHostAndCert.js` script
* run `docker-compose build` to build the container network
* run `docker-compose up` to start the container running PWA at the custom domain with https

After `docker/run-docker` is executed from the root of the repository, the default configuration will have the PWA application running at `https://pwa-docker.localhost`.

## Configure a new custom domain

The domain is configurable. Two changes are needed to configure a new domain name.

1. Change `PWA_STUDIO_PUBLIC_PATH` key to the new domain in `docker/.env.docker`.
2. Change the `--host` value in the `watch:docker` script in `packages/venia-concept/package.json` to the new domain.

## Service Workers and Hot Reloading

Service workers are disabled by default when running the `docker/run-docker` script, but they can easily be turned on by changing the default value of `ENABLE_SERVICE_WORKER_DEBUGGING=0` to `ENABLE_SERVICE_WORKER_DEBUGGING=1` in `.env.docker`.

Hot reloading is enabled by default when running the `docker/run-docker` script and automatically refreshes the browser on changes made in the container as well as on the host machine, ie your local file system. 

If service workers are enabled during development, then service worker caching will affect the hot reloading and will require a manual refresh after the cached assets have fully reloaded.

In order to avoid manual page refreshing and have hot reloading work as expected with service workers, it is recommended for developers to click the `Update on reload` checkbox in the `Service Workers` panel in Chrome developer tools. This feature in Chrome is helpful when developing with service workers because it ensures that the service worker is updated on every page reload and you will see changes immediately, avoiding the service worker cache.

For more details check out the [dev tools docs](https://bit.ly/2tTGWc0).

