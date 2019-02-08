# Run PWA with Docker

1. Install Docker for your system: https://docs.docker.com/install
2. Clone the repository:
    ```
    git clone https://github.com/magento-research/pwa-studio
    ```
3. In the root of the repository, run 
    ```
    docker/run-docker
    ```
4. Once the script completes, a locally running instance of pwa will be available at `https://pwa-docker.localhost`.

The domain is configurable. Two changes are needed to configure a new domain name.

1. Change `PWA_STUDIO_PUBLIC_PATH` key to the new domain under `docker/.env.docker`.
2. Change the `--host` value in the `watch:docker` script under `packages/venia-concept/package.json` to the new domain.