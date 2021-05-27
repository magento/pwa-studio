import React from 'react';
import { Circle } from 'react-feather';
// import { node, shape, string } from 'prop-types';
import { Radio as InformedRadio } from 'informed';

import { useStyle } from '../../classify';
import defaultClasses from './radio.css';

/* TODO: change lint config to use `label-has-associated-control` */
/* eslint-disable jsx-a11y/label-has-for */

const RadioOption = props => {
    const { classes: propClasses, id, label, value, ...rest } = props;
    const classes = useStyle(defaultClasses, propClasses);

    return (
        <label className={classes.root} htmlFor={id}>
            <InformedRadio
                {...rest}
                className={classes.input}
                id={id}
                value={value}
            />
            <span className={classes.icon}>
                <Circle />
            </span>
            <span className={classes.label}>
                {label || (value != null ? value : '')}
            </span>
        </label>
    );
};

export default RadioOption;

// export class RadioOption extends Component {
//     static propTypes = {
//         classes: shape({
//             input: string,
//             label: string,
//             root: string,
//             icon: string
//         }),
//         label: node.isRequired,
//         value: node.isRequired
//     };

//     render() {
//         const { props } = this;
//         const { classes, id, label, value, ...rest } = props;

//         return (
//             <label className={classes.root} htmlFor={id}>
//                 <Radio
//                     {...rest}
//                     className={classes.input}
//                     id={id}
//                     value={value}
//                 />
//                 <span className={classes.icon}>
//                     <Circle />
//                 </span>
//                 <span className={classes.label}>
//                     {label || (value != null ? value : '')}
//                 </span>
//             </label>
//         );
//     }
// }

// /* eslint-enable jsx-a11y/label-has-for */

// export default classify(defaultClasses)(RadioOption);
