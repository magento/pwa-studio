import getStyles from '../../RestApi/S3/getStyles';
import { useCallback } from 'react';

export const useStyle = () => {

    function applyStylesInApp(styles) {
        const stylekeys = Object.keys(styles);
        for (const styleProps of stylekeys) {
            for (const tokenKey of Object.keys(styles[styleProps])) {
                document.documentElement.style.setProperty(tokenKey, styles[styleProps][tokenKey]);
            }
        }
    }
    
    function applyDefaultStyles() {
        import('../../../../venia-ui/lib/cssTokens.json').then(styles => {
            applyStylesInApp(styles);
        });
    }

    const applyStyles = useCallback(() => {
        if (process.env.MULTITENANT_ENABLED === 'true') {
          getStyles()
            .then((styles) => {
              applyStylesInApp(styles)
            })
            .catch(() => {
              applyDefaultStyles()
            });
        } else {
          applyDefaultStyles();
        }
      }, []);

    return {
        applyStyles
    };
};