import {
    Children,
    cloneElement,
    useCallback,
    useEffect,
    useState
} from 'react';

export const useAccordion = props => {
    const { canOpenMultiple, children } = props;

    const [openSectionIndicies, setOpenSectionIndicies] = useState(new Set([]));

    const handleSectionClick = useCallback(
        sectionIndex => {
            const updatedIndicies = new Set(openSectionIndicies);

            if (!openSectionIndicies.has(sectionIndex)) {
                // The user wants to open this section.
                if (!canOpenMultiple) {
                    updatedIndicies.clear();
                }

                updatedIndicies.add(sectionIndex);
            } else {
                // The user wants to close this section.
                updatedIndicies.delete(sectionIndex);
            }

            setOpenSectionIndicies(updatedIndicies);
        },
        [canOpenMultiple, openSectionIndicies, setOpenSectionIndicies]
    );

    // The accordion must tell each child section:
    // 1. Whether it should be open or not.
    // 2. What index it is.
    // 3. A callback function to call when it gets clicked.
    const controlledChildren = Children.map(children, (child, childIndex) => {
        const isOpen = openSectionIndicies.has(childIndex);

        return cloneElement(child, {
            handleClick: handleSectionClick,
            index: childIndex,
            isOpen
        });
    });

    // If any of the sections have their isOpen prop set to true initially,
    // honor that.
    useEffect(() => {
        const isOpenPropTruthy = child => child.props.isOpen;

        const openSectionsControlled = new Set([]);
        let firstOpenSectionIndex = Number.NEGATIVE_INFINITY;

        const childArray = Children.toArray(children);

        childArray.forEach((child, childIndex) => {
            if (isOpenPropTruthy(child)) {
                openSectionsControlled.add(childIndex);

                if (firstOpenSectionIndex === Number.NEGATIVE_INFINITY) {
                    firstOpenSectionIndex = childIndex;
                }
            }
        });

        // If there are multiple sections with isOpen props initially set to true
        // and we only allow one, just use the first one.
        if (!canOpenMultiple && openSectionsControlled.size > 1) {
            openSectionsControlled.clear();
            openSectionsControlled.add(firstOpenSectionIndex);
        }

        setOpenSectionIndicies(openSectionsControlled);
    }, [canOpenMultiple, children]);

    return {
        controlledChildren
    };
};
