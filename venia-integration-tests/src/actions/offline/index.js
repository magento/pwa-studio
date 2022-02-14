export const checkServiceWorker = () => {
    const serviceWorkerStatus = navigator?.serviceWorker?.controller?.state;
    return serviceWorkerStatus;
};
