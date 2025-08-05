async function getGraphQL(
    query = '',
    variables = {},
    store = '',
    baseUrl = ''
) {
    const graphqlEndpoint = baseUrl
        ? `${baseUrl}/graphql`
        : `${window.origin}/graphql`;

    const response = await fetch(graphqlEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Store: store
        },
        body: JSON.stringify({
            query,
            variables
        })
    });

    return response.json();
}

export { getGraphQL };
