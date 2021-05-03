import axios from 'axios';
import { QueryCache, useMutation } from 'react-query';
import { Product } from './type';

const useDeleteFn = () => {
  return useMutation(async (values: Product) => {
    await axios.delete(`products/${values.id}`);
  });
};

export default useDeleteFn;
