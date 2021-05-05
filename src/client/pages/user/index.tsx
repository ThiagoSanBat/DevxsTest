import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios, { AxiosResponse } from 'axios';
import Router from 'next/router';
import React, { useContext, useEffect } from 'react';
import {
  UseMutateAsyncFunction,
  useMutation,
  useQuery,
  useQueryClient,
} from 'react-query';
import { Column, useTable } from 'react-table';

import Layout from '../../components/layout';
import { User } from '../../lib/api/products/type';
import { AuthContext, SubscriptionLevelEnum } from '../../lib/token';

const columns: Column<User>[] = [
  {
    Header: 'Name',
    accessor: 'name',
  },
  {
    Header: 'Email',
    accessor: 'email',
  },
  {
    Header: 'Role',
    accessor: 'role',
  },
];

const Action: React.FC<{
  id: number;
  deleteHandler: UseMutateAsyncFunction<
    AxiosResponse<any>,
    unknown,
    number,
    unknown
  >;
}> = ({ id, deleteHandler }) => {
  const { userAuthenticated } = useContext(AuthContext);

  return (
    <>
      <td className="flex float-right border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-right">
        {userAuthenticated.id !== id && (
          <a className="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700 cursor-pointer">
            <FontAwesomeIcon icon={faTrash} onClick={() => deleteHandler(id)} />
          </a>
        )}
        <a className="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700 cursor-pointer">
          <FontAwesomeIcon
            icon={faPen}
            onClick={() => Router.push(`/user/edit?id=${id}`)}
          />
        </a>
      </td>
    </>
  );
};

const UserTable: React.FC<{
  users: User[];
  deleteUser: UseMutateAsyncFunction<
    AxiosResponse<any>,
    unknown,
    number,
    unknown
  >;
}> = ({ users, deleteUser }) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data: users });

  return (
    <table
      {...getTableProps()}
      className="items-center w-full bg-transparent border-collapse"
    >
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th
                {...column.getHeaderProps()}
                className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-indigo-50 text-indigo-500 border-indigo-100"
              >
                {column.render('Header')}
              </th>
            ))}
            <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-indigo-50 text-indigo-500 border-indigo-100" />
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cell) => (
                <td
                  {...cell.getCellProps()}
                  className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
                >
                  {cell.render('Cell')}
                </td>
              ))}
              <Action deleteHandler={deleteUser} id={row.original.id} />
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

const ProductList = () => {
  const { data: users, isLoading, error } = useQuery('usersData', () =>
    axios.get<User[]>('/users').then((res) => res.data),
  );

  const { userAuthenticated } = useContext(AuthContext);

  const queryClient = useQueryClient();

  const { mutateAsync } = useMutation(
    (id: number) => axios.delete(`users/${id}`),
    {
      onSuccess: () => queryClient.invalidateQueries('usersData'),
    },
  );

  useEffect(() => {
    if (
      !userAuthenticated ||
      (userAuthenticated &&
        userAuthenticated.role !== SubscriptionLevelEnum.Admin)
    ) {
      Router.push('/product');
    }
  }, []);

  return (
    <Layout>
      <div className="w-full mb-12 px-4">
        <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white">
          <div className="rounded-t mb-0 px-4 py-3 border-0">
            <div className="flex flex-wrap items-center">
              <div className="relative flex w-full px-4 max-w-full flex-grow flex-1 justify-between">
                <h3 className="font-semibold text-lg text-blueGray-700">
                  Users
                </h3>

                <button
                  className="bg-indigo-500 text-white font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                  onClick={() => Router.push('/user/edit')}
                >
                  Add
                </button>
              </div>
            </div>
          </div>
          <div className="block w-full overflow-x-auto">
            {isLoading ? (
              'is loading'
            ) : error ? (
              'error'
            ) : (
              <UserTable users={users} deleteUser={mutateAsync} />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductList;
