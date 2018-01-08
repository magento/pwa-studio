export const extract = (obj, name = 'default') =>
    Promise.resolve(obj)
        .then(mod => mod[name])
        .catch(() => {
            throw new Error(`Object is not a valid module.`);
        });
