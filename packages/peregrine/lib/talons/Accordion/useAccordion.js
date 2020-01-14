import { Children, useCallback, useEffect, useState } from 'react';

export const useAccordion = props => {
    const { canOpenMultiple, children } = props;

    const [openSections, setOpenSections] = useState(new Set([]));

    const handleSectionToggle = useCallback(
        key => {
            setOpenSections(prevOpenSections => {
                const nextOpenSections = new Set(prevOpenSections);

                if (!prevOpenSections.has(key)) {
                    // The user wants to open this section.
                    if (!canOpenMultiple) {
                        nextOpenSections.clear();
                    }

                    nextOpenSections.add(key);
                } else {
                    // The user wants to close this section.
                    nextOpenSections.delete(key);
                }

                return nextOpenSections;
            });
        },
        [canOpenMultiple, setOpenSections]
    );

    // If any of the sections have their isOpen prop set to true initially,
    // honor that.
    useEffect(() => {
        const isOpenPropTruthy = child => child.props.isOpen;

        const openSectionIds = new Set([]);
        let firstOpenSectionId;

        Children.toArray(children).forEach(child => {
            if (isOpenPropTruthy(child)) {
                const { id: childId } = child.props;

                openSectionIds.add(childId);

                if (!firstOpenSectionId) {
                    firstOpenSectionId = childId;
                }
            }
        });

        // If there are multiple sections with isOpen props initially set to true
        // and we only allow one, just use the first one.
        if (!canOpenMultiple && openSectionIds.size > 1) {
            openSectionIds.clear();
            openSectionIds.add(firstOpenSectionId);
        }

        setOpenSections(openSectionIds);
    }, [canOpenMultiple, children]);

    return {
        handleSectionToggle,
        openSections
    };
};
