import {
    Children,
    cloneElement,
    useCallback,
    useEffect,
    useState
} from 'react';

const NO_SECTIONS_OPEN_INDEX = Number.NEGATIVE_INFINITY;

export const useAccordion = props => {
    const { canOpenMultiple, children } = props;

    const [openSectionIndex, setOpenSectionIndex] = useState(NO_SECTIONS_OPEN_INDEX);

    const handleSectionClick = useCallback(
        sectionIndex => {
            const desiredIndex = sectionIndex !== openSectionIndex ? sectionIndex : NO_SECTIONS_OPEN_INDEX;
            setOpenSectionIndex(desiredIndex);
        },
        [openSectionIndex, setOpenSectionIndex]
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

    // If any of the sections have their isOpen prop set to true initially,
    // honor that.
    // If there are multiple sections with isOpen props initially set to true
    // and we only allow one, use the first one.
    useEffect(() => {
        const isOpenPropTruthy = child => child.props.isOpen;

        const childArray = Children.toArray(children);
        const firstOpenSectionIndex = childArray.findIndex(
            isOpenPropTruthy
        );
        if (firstOpenSectionIndex > -1) {
            setOpenSectionIndex(firstOpenSectionIndex);
        }
    }, [canOpenMultiple, children, setOpenSectionIndex]);

    return {
        childSections
    };
};
