import React from 'react';

const Heading = ({headingType, text}) => {
    const HeadingType = `${headingType.toLowerCase()}`;
    return (
        <HeadingType data-content-type="heading">
            {text}
        </HeadingType>
    );
};

export default Heading;
