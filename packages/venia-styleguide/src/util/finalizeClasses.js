const finalizeClasses = (classes, state) => {
    const map = new Map();

    for (const name in classes) {
        if (name.includes('--')) continue;

        let value = name;

        for (const pair of Object.entries(state)) {
            value = `${value}--${pair[0]}-${pair[1]}`;
        }

        map.set(name, classes[value]);
    }

    return map;
};

export default finalizeClasses;
