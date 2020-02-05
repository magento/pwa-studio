/*
 * Based on the WebAIM contrast checker authored by Jared Smith.
 *
 * https://gist.github.com/btopro/0967c237f6795d9498340fb8b6f25b60
 * http://webaim.org/resources/contrastchecker/
 */

export const getHex = channel => parseInt(channel).toString(16);

export const getSRGB = channel => {
    const factor = channel / 255;

    return factor <= 0.03928
        ? factor / 12.92
        : Math.pow((factor + 0.055) / 1.055, 2.4);
};

export const getLightness = channels => {
    const [r, g, b] = channels.map(getSRGB);

    return r * 0.2126 + g * 0.7152 + b * 0.0722;
};
