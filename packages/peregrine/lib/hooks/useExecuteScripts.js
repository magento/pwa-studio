import { useRef, useEffect } from 'react';
import { nonceGenerator } from '../../lib/util/nonceGenerator';

const removeHtmlComments = html => {
    return html.replace(/<!--[\s\S]*?-->/g, '');
};

export const  useExecuteScripts = htmlContent => {
    const containerRef = useRef(null);
    const lastScriptTagRef = useRef(null);
    const originalDocumentWrite = document.write;

    useEffect(() => {
        if (containerRef.current) {
            /**
             * Overriding the document.write function to make sure
             * Javascript is writing the content in a place they intent to
             * write instead of replacing the whole document.
             *
             */

            document.write = function(content) {
                console.log(lastScriptTagRef.current);
                if (lastScriptTagRef.current) {
                    const span = document.createElement('span');
                    const scriptNode = lastScriptTagRef.current;
                    span.innerHTML = content;
                    console.log(scriptNode);
                    if (scriptNode) scriptNode.after(span);
                } else {
                    originalDocumentWrite.call(document, content);
                }
            };

            // Remove HTML comments
            const contentWithoutComments = removeHtmlComments(htmlContent);
            containerRef.current.innerHTML = contentWithoutComments;

            const scriptTags = containerRef.current.querySelectorAll('script');

            scriptTags.forEach(scriptTag => {
                const newScript = document.createElement('script');
                const nonce = nonceGenerator(24);
                newScript.type = scriptTag.type || 'text/javascript';
                newScript.setAttribute('nonce', nonce);

                if (scriptTag.src) {
                    newScript.src = scriptTag.src;
                } else {
                    newScript.textContent = scriptTag.innerHTML;
                }

                lastScriptTagRef.current = newScript;

                scriptTag.replaceWith(newScript);
            });
        }

        return () => {
            document.write = originalDocumentWrite;
        };
    }, [htmlContent]);

    return containerRef;
};
