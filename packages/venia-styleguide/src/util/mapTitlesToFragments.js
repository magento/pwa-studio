const mapTitlesToFragments = titles => {
    const map = new Map();

    for (const title of titles) {
        const id = title.replace(/\s/g, '-') || '';
        const fragment = `#${id}`;

        map.set(title, { fragment, id, title });
    }

    return map;
};

export default mapTitlesToFragments;
