import React from 'react';
import { gql, useQuery } from '@apollo/client';
import classes from './mesh.module.css';

const MeshDemo = () => {
    const { data } = useQuery(GET_RUNTIME);
    const content = data ? data.runtime.text : 'Loading...';

    const style = {
        '--image': data ? `url("${data.runtime.image}")` : ''
    };

    return (
        <div className={classes.root} style={style}>
            {content}
        </div>
    );
};

export default MeshDemo;

const GET_RUNTIME = gql`
    {
        runtime
    }
`;
