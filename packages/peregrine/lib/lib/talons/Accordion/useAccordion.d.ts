export function useAccordion(props: any): {
    handleSectionToggle: (sectionId: any) => void;
    openSectionIds: Set<any>;
};
