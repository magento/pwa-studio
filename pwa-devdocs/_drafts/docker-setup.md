# Run PWA with Docker

1. Install Docker for your system: https://docs.docker.com/install
2. Clone the repository:
    ```
    git clone https://github.com/magento-research/pwa-studio
    ```
3. In the root of the repository, run 
    ```
    docker build -t pwa:2.0 .
    ```
4. Once the build completes, run `docker images` to confirm your image is present.
5. Copy the docker environment config file:
    ```
    cp packages/venia-concept/.env.docker packages/venia-concept/.env
    ```
6. To mount the present working directory to the container and run the application with hot reloading:
    ```
    docker run -p 8080:8080 -v "$(pwd)"/:/usr/src/app pwa:2.0
    ```
7. To just run the application in the browser without mounting any directories:
    ```
    docker run -p 8080:8080 pwa:2.0
    ```
7. Go to http://0.0.0.0:8080/ in your browser to see the application running. 
8. Make changes in your filesystem or in the container and the changes will persist in both locations if you run the container with a mounted volume.