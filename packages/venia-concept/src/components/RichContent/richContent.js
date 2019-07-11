import React, { Suspense } from 'react';
import parseStorageHtml from './parseStorageHtml';
import Row from './row';
import Column from './column';
import ColumnGroup from './columnGroup';
import GenericElement from './genericElement';

export const Widgets = {
    static: {
        row: Row,
        column: Column,
        'column-group': ColumnGroup
    },
    dynamic: {
        tabs: React.lazy(() => import('./tabs'))
    }
};

const walk = ({ widgets }) =>
    widgets.map((node, i) => <RichContent key={i} data={node} />);

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
            <Widget data={dataNode} html={html}>
                {walk(dataNode)}
            </Widget>
        );
    }

    const DynamicWidget = Widgets.dynamic[dataNode.type];
    if (DynamicWidget) {
        return (
            <Suspense fallback={fallback}>
                <DynamicWidget data={dataNode} html={html}>
                    {walk(dataNode)}
                </DynamicWidget>
            </Suspense>
        );
    }

    return <GenericElement data={dataNode}>{walk(dataNode)}</GenericElement>;
};

export default RichContent;
