interface Environment {
    [name: string]: EnvironmentInfo;
}
interface EnvironmentInfo {
    baseUrl: string;
}

export const environment: Environment = {
    prod: {
        baseUrl: 'https://magento-venia.now.sh',
    },
    local: {
        baseUrl: 'https://localhost:8080',
    },
};