/**
 * Replace all instances of one URL base in an HTML response, with another.
 * Useful for proxying to systems like Magento, which often generate absolute
 * URLs in their render output.
 *
 * Rather than configure Magento to use the your temporary dev server URL as
 * its configured base domain, this middleware allows the dev server to text
 * replace any links, resources, or reference URLs on the fly.
 *
 * For Magento 2 specifically, This is a stopgap until we can hack Framework to
 * have branch logic in asset URL resolvers.
 */
const debug = require('../../util/debug').makeFileLogger(__filename);
const url = require('url');
const harmon = require('harmon');
const through = require('through');
const removeTrailingSlash = x => x.replace(/\/$/, '');
module.exports = function createOriginSubstitutionMiddleware(
    oldDomain,
    newDomain
) {
    const oldOrigin = removeTrailingSlash(url.format(oldDomain));
    const newOrigin = removeTrailingSlash(url.format(newDomain));
    const attributesToReplaceOrigin = ['href', 'src', 'style'].map(attr => ({
        query: `[${attr}*="${oldOrigin}"]`,
        func(node) {
            node.setAttribute(
                attr,
                node
                    .getAttribute(attr)
                    .split(oldOrigin)
                    .join(newOrigin)
            );
        }
    }));
    const tagsToReplaceOrigin = ['style'].map(attr => ({
        query: attr,
        func(node) {
            const stream = node.createStream();
            stream
                .pipe(
                    through(function(buf) {
                        this.queue(
                            buf
                                .toString()
                                .split(oldOrigin)
                                .join(newOrigin)
                        );
                    })
                )
                .pipe(stream);
        }
    }));
    debug(
        `replace ${oldOrigin} with ${newOrigin} in html`,
        attributesToReplaceOrigin
    );
    const allTransforms = [
        ...tagsToReplaceOrigin,
        ...attributesToReplaceOrigin
    ];
    return harmon([], allTransforms, true);
};
