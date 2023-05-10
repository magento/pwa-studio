import React from 'react';
import defaultClasses from './table.module.css';
import { useStyle } from './../../classify';

const Table = props => {
    const { headers, tableRows } = props;
    const classes = useStyle(defaultClasses);
    return (
        <div>
            <table className={classes.creditTable}>
                <thead>
                    <tr>
                        {headers.map(ele => (
                            <th scope="col">{ele}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {tableRows?.map(row => (
                        <tr key={row[0].value}>
                            {row.map(cell => (
                                <td className={cell?.classes} data-label={cell.dataLable}>
                                    {cell.value}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Table;