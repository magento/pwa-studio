import { mse } from '@magento/venia-data-collector';

let cleared = {};

// oddly, these functions error when not wrapped in a hook. 🤷
const useObserver = () => {
  const meetThreshold = (entries, unit) => {
    entries.forEach(entry => {
      const { isIntersecting, intersectionRatio } = entry;
      const { unitId } = unit;

      if (!isIntersecting) {
        cleared[unitId] = true;
      }
      if (cleared[unitId] !== false && intersectionRatio >= 0.5) {
        cleared[unitId] = false;
        mse.publish.recsUnitView(unit.unitId);
      }
    });
  };

  const observeUnit = (unit, element) => {
    if (element) {
      const options = {
        threshold: [0.0, 0.5],
      };
      const observer = new IntersectionObserver(
        entries => meetThreshold(entries, unit),
        options,
      );
      observer.observe(element);
    } else {
      console.warn(
        'VeniaProductRecommendations IntersectionObserver: Element is either null or undefined.',
      );
    }
  };
  return { observeUnit };
};

export default useObserver;
