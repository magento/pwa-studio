const { Targetables } = require('@magento/pwa-buildpack');
/* eslint-disable */

function localIntercept(targets) {
    const targetables = Targetables.using(targets);

    const PDP = targetables.reactComponent(
        '@magento/venia-ui/lib/components/ProductFullDetail/productFullDetail.js'
    );

    const MeshDemo = PDP.addImport(
        `MeshDemo from "@magento/venia-concept/src/mesh.js"`
    );

    PDP.insertBeforeJSX('<Form>', `<${MeshDemo} />`);
}

module.exports = localIntercept;
