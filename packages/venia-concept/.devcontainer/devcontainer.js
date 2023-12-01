{
	"name": "PWA Studio",
	"image": "mcr.microsoft.com/devcontainers/javascript-node:0-18",
	"containerEnv": {
		"NODE_OPTIONS": "--openssl-legacy-provider"
	},
	"forwardPorts": [10000],
	"postCreateCommand": "yarn install --frozen-lockfile && yarn build && yarn workspace @magento/venia-concept run watch",
	"extensions": [
		"larsroettig.vscode-pwa-studio",
		"GraphQL.vscode-graphql-syntax"
	]
}
