import React, { Suspense } from 'react';
import parseStorageHtml from './parseStorageHtml';
import Row from './row';
import Column from './column';
import ColumnGroup from './columnGroup';

export const Widgets = {
    static: {
        row: Row,
        column: Column,
        columnGroup: ColumnGroup
    },
    dynamic: {
        tabs: React.lazy(() => import('./tabs')),
        tabItem: React.lazy(() => import('./tabItem'))
    }
};

const walk = ({ children }) =>
    children.map(node => <RichContent data={node} />);

const RichContent = ({ data, html }) => {
    const fallback = html ? (
        <div dangerouslySetInnerHTML={{ __html: html }} />
    ) : null;

    const dataNode = data || parseStorageHtml(html);
    if (!dataNode.type) {
        return fallback;
    }

    const Widget = Widgets.static[dataNode.type];
    if (Widget) {
        return (
            <Widget data={data} html={html}>
                {walk(data)}
            </Widget>
        );
    }

    const DynamicWidget = Widgets.dynamic[dataNode.type];
    if (DynamicWidget) {
        return (
            <Suspense fallback={fallback}>
                <DynamicWidget data={data} html={html}>
                    {walk(data)}
                </DynamicWidget>
            </Suspense>
        );
    }

    return fallback;
};
