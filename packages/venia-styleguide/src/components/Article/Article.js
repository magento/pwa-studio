import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState
} from 'react';

import classes from './Article.css';

const ArticleContext = createContext();

const Article = props => {
    const { children, title } = props;
    const [sections, setSections] = useState(new Map());

    const addSection = useCallback(
        (title, id) => {
            setSections(prevMap => {
                const nextMap = new Map(prevMap);

                return nextMap.set(title, id);
            });
        },
        [setSections]
    );

    const contextValue = useMemo(() => [sections, addSection], [
        addSection,
        sections
    ]);

    useEffect(() => {
        document.title = `${title} – Venia Styleguide`;
    }, [title]);

    return (
        <ArticleContext.Provider value={contextValue}>
            <article className={classes.root}>
                <h1 className={classes.title}>{title}</h1>
                {children}
            </article>
        </ArticleContext.Provider>
    );
};

export default Article;

export const useArticleContext = () => useContext(ArticleContext);
