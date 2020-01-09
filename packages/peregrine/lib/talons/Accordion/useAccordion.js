import {
    Children,
    cloneElement,
    useCallback,
    useEffect,
    useState
} from 'react';

export const useAccordion = props => {
    const { canOpenMultiple, children } = props;

    const [openSectionIndex, setOpenSectionIndex] = useState(0);

    const handleSectionClick = useCallback(
        sectionIndex => {
            console.log('A section was clicked!', sectionIndex);
            setOpenSectionIndex(sectionIndex);
        },
        [setOpenSectionIndex]
    );

    // If there can't be multiple sections open, the accordion must control open states.
    const accordionControlsSections = !canOpenMultiple;

    let childSections = children;
    if (accordionControlsSections) {
        // The accordion must tell each section:
        // 1. It is controlled (it does not control its own isOpen state).
        // 2. Whether it should be open or not.
        // 3. What index it is.
        // 4. And a callback function to call when it gets clicked.
        const isControlled = true;
        childSections = Children.map(children, (child, index) => {
            const isOpen = index === openSectionIndex;

            return cloneElement(child, {
                handleClick: handleSectionClick,
                index,
                isControlled,
                isOpen
            });
        });
    }

    // If there are multiple sections with isOpen props initially set to true
    // and we only allow one, use the first one.
    useEffect(() => {
        const isOpenPropTruthy = child => child.props.isOpen;

        const childArray = Children.toArray(children);
        const openSections = childArray.filter(isOpenPropTruthy);

        if (!canOpenMultiple && openSections.length > 1) {
            const firstOpenSectionIndex = childArray.findIndex(
                isOpenPropTruthy
            );
            console.log('setting open index to', firstOpenSectionIndex);
            setOpenSectionIndex(firstOpenSectionIndex);
        }
    }, [canOpenMultiple, children, setOpenSectionIndex]);

    return {
        childSections
    };
};
