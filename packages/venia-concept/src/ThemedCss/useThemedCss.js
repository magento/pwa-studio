import { useEffect, useState } from 'react';
import { BrowserPersistence } from '@magento/peregrine/lib/util';
const storage = new BrowserPersistence();

// ComponentName.StoreCode.CSSFileName
const COMPONENT_THEMED_CSS = {
    Button: {
        fr: 'frenchButton'
    }
};

// The hook that loads/returns custom css for a theme.
const useThemedCss = (ComponentName, defaultClasses) => {
    const storeCode = storage.getItem('store_view_code');
    const [css, setCss] = useState(defaultClasses);

    useEffect(() => {
        loadCss(storeCode);

        async function loadCss(storeCode) {
            let dynamicCss;
            const ComponentThemes = COMPONENT_THEMED_CSS[ComponentName];
            if (ComponentThemes) {
                const theme = ComponentThemes[storeCode];
                if (theme) {
                    dynamicCss = await import(`./${theme}.css`);
                }
                // etc.
            }

            setCss(dynamicCss.default);
        }
    }, [ComponentName, storeCode]);

    return css;
};

export default useThemedCss;
