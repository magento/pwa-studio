import { useState, useEffect } from 'react';
import useRecsData from './useRecsData';
import { mse } from '@magento/venia-data-collector';

const useRecsTrackingProps = props => {
  const [units, setUnits] = useState([]);
  const { data, isLoading, error } = useRecsData(props);

  useEffect(() => {
    if (data && data.results) {
      let tmpUnits = data.results.map(unit => {
        const newUnit = {
          ...unit,
          pageType: props.pageType,
        };

        const products = unit.products.map(product => {
          const newProduct = { ...product, unit: newUnit };
          const onClick = () => {
            const { unit, productId } = newProduct;
            mse.publish.recsItemClick(unit.unitId, productId);
          };
          return { ...newProduct, onClick };
        });
        return { ...newUnit, products };
      });

      setUnits(tmpUnits);
    }
  }, [data, props.pageType]);
  return { units, isLoading, error };
};

export default useRecsTrackingProps;
