# Run PWA with Docker

1. Install Docker for your system: https://docs.docker.com/install
2. Clone the repository:
    ```
    git clone https://github.com/magento/pwa-studio
    ```
    *Note*: Windows users will want to ensure that [shared drives](https://docs.docker.com/docker-for-windows/#shared-drives) are enabled.
3. In the root of the repository, run 
    ```
    docker/run-docker
    ```
4. Once the script completes, a locally running instance of pwa will be available at `https://pwa-docker.localhost`.

## Configure a custom domain

The domain is configurable. Just set `PWA_STUDIO_PUBLIC_PATH` key to the new domain under `docker/.env.docker`, or pass a custom .env file with the `PWA_STUDIO_PUBLIC_PATH` key set. All required fields can be found in `docker/.env.docker`. See how to pass the custom .env file below.

## Pass custom .env file configuration through cli args (optional)

To use a custom .env file for configuration, pass it to the `run-docker` script like so: `docker/run-docker -e path-from-project-root`. This file will take the place of the default `.env.docker` file.

## Service Workers and Hot Reloading

Service workers are disabled by default when running the `docker/run-docker` script, but they can easily be turned on by changing the default value of `DEV_SERVER_SERVICE_WORKER_ENABLED=false` to `DEV_SERVER_SERVICE_WORKER_ENABLED=true` in `.env.docker`.

Hot reloading is enabled by default when running the `docker/run-docker` script and automatically refreshes the browser on changes made in the container as well as on the host machine, ie your local file system. 

If service workers are enabled during development, then service worker caching will affect the hot reloading and will require a manual refresh after the cached assets have fully reloaded.

In order to avoid manual page refreshing and have hot reloading work as expected with service workers enabled, it is recommended for developers to click the `Update on reload` checkbox in the `Service Workers` panel in Chrome developer tools. This feature in Chrome is helpful when developing with service workers because it ensures that the service worker is updated on every page reload and you will see changes immediately, avoiding the service worker cache.

For more details check out the [dev tools docs](https://bit.ly/2tTGWc0).

### Hot Reloading is not working

If you find that hot reloading is not working for you the webpack docs recommend using [polling](https://webpack.js.org/configuration/watch/#watchoptionspoll) as watching does not work with network file systems and machines in VirtualBox. To enable polling, set `DEV_SERVER_WATCH_OPTIONS_USE_POLLING=1` in `.env.docker`.
