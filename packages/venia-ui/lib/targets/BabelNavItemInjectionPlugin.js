const babelTemplate = require('@babel/template');

function BabelNavItemInjectionPlugin() {
    const linkTag = ({ name, to }) =>
        babelTemplate.expression.ast(
            `<li className={classes.item}>
                <NavLink
                    activeClassName={classes.active}
                    className={classes.link}
                    to="${to}"
                >
                    <span className={classes.text}>${name}</span>
                </NavLink>
            </li>`,
            {
                plugins: ['jsx']
            }
        );

    return {
        visitor: {
            Program: {
                enter(_, state) {
                    state.navItems = [];
                    const seenNames = new Map();
                    const requests = this.opts.requestsByFile[this.filename];
                    for (const request of requests) {
                        const { requestor, options } = request;
                        for (const navItem of options.navItems) {
                            const seenName = seenNames.get(navItem.name);
                            if (!seenName) {
                                seenNames.set(navItem.name, {
                                    requestor,
                                    navItem
                                });
                            } else {
                                throw new Error(
                                    `@magento/venia-ui: Conflict in "navItems" target. "${
                                        request.requestor
                                    }" is trying to add a route ${JSON.stringify(
                                        navItem
                                    )}, but "${
                                        seenName.requestor
                                    }" has already declared that route pattern: ${JSON.stringify(
                                        seenName.navItem
                                    )}`
                                );
                            }
                            state.navItems.push(navItem);
                        }
                    }
                }
            },
            JSXElement: {
                enter(path, state) {
                    const { openingElement } = path.node;
                    if (!openingElement || openingElement.name.name !== 'ul')
                        return;
                    while (state.navItems.length > 0) {
                        path.node.children.push(linkTag(state.navItems.pop()));
                    }
                }
            }
        }
    };
}

module.exports = BabelNavItemInjectionPlugin;
