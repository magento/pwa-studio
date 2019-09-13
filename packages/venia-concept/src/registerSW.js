if (
    process.env.NODE_ENV === 'production' ||
    process.env.DEV_SERVER_SERVICE_WORKER_ENABLED
) {
    window.addEventListener('load', () =>
        navigator.serviceWorker
            .register(`/sw.${process.env.SERVICE_WORKER_HASH}.js`)
            .then(registration => {
                console.log('Service worker registered: ', registration);
            })
            .catch(error => {
                console.log('Service worker registration failed: ', error);
            })
    );
}
