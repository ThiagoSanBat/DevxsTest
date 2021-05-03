import axios from 'axios';
import { useQuery } from 'react-query';
import { Product } from './type';

const useListDataFetch = () => {
  const getProducts = () =>
    axios.get<Product[]>('/products').then((res) => res.data);

  const { data: products, isLoading, error } = useQuery(
    'productsData',
    getProducts,
  );

  return {
    products,
    isLoading,
    error,
  };
};

export default useListDataFetch;
