import axios from 'axios';
import { Field, Form, Formik } from 'formik';
import React, { useContext, useEffect } from 'react';
import { object, string } from 'yup';
import { toast } from 'react-toastify';
import Layout from '../../components/layout';
import Router, { useRouter } from 'next/router';
import { useMutation, useQuery } from 'react-query';
import { AuthContext, SubscriptionLevelEnum } from '../../lib/token';
import { User } from '../../lib/api/products/type';

type DefaultValue = { data: User; isLoading: boolean; error: unknown };

const defaultValue: DefaultValue = {
  data: {
    name: '',
    email: '',
    role: '',
    password: '',
  },
  isLoading: false,
  error: undefined,
};

const UserManager = () => {
  const router = useRouter();
  const { id } = router.query;

  const isEdit = !Number.isNaN(+id);

  const { data: user, isLoading, error } = isEdit
    ? useQuery(['user', id], (context) =>
        axios
          .get<User>(`/users/${context.queryKey[1]}`)
          .then((res) => res.data),
      )
    : defaultValue;

  const UserSchemaNew = object().shape({
    name: string().required('Name is required'),
    email: string().required('Email is required'),
    password: string().required('Password is required'),
  });

  const UserSchemaUpdate = object().shape({
    name: string().required('Name is required'),
    email: string().required('Email is required'),
  });

  const { mutateAsync: createUser } = useMutation('createUser', (user: User) =>
    axios.post('/users', user),
  );
  const { mutateAsync: updateUser } = useMutation('updateUser', (user: User) =>
    axios.patch(`/users/${id}`, user),
  );

  const save = (user: User) => {
    return isEdit ? updateUser(user) : createUser(user);
  };

  const { userAuthenticated } = useContext(AuthContext);

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
      {isLoading ? (
        <span className="flex h-3 w-3">
          <span className="animate-spin h-5 w-5 mr-3 bg-black opacity-75"></span>
        </span>
      ) : (
        <>
          <Formik
            enableReinitialize
            initialValues={{
              id: user?.id ?? undefined,
              name: user?.name ?? '',
              email: user?.email ?? '',
              password: user?.password ?? '',
              role: user?.role ?? 'Guest',
            }}
            validationSchema={isEdit ? UserSchemaUpdate : UserSchemaNew}
            onSubmit={(values, { resetForm }) =>
              save(values)
                .then((v) => {
                  resetForm();
                  Router.push('/user');
                })
                .catch((err) => {
                  toast(
                    'Sorry, something went wrong. Please try again later!',
                    { type: 'error' },
                  );
                })
            }
          >
            {({ errors, touched }) => (
              <>
                <div className="w-full lg:w-8/12 px-4">
                  <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-gray-100	 border-0">
                    <div className="rounded-t bg-white mb-0 px-6 py-6">
                      <div className="text-center flex justify-between">
                        <h6 className="text-blueGray-700 text-xl font-bold">
                          User
                        </h6>
                      </div>
                    </div>
                    <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                      <Form>
                        <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
                          User Information
                        </h6>
                        <div className="flex flex-wrap">
                          <div className="w-full lg:w-6/12 px-4">
                            <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                              Name
                            </label>
                            <Field
                              type="text"
                              className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                              name="name"
                            />
                            {touched.name && errors.name && (
                              <div className="font-mono text-red-500">
                                {errors.name}
                              </div>
                            )}
                          </div>
                          <div className="w-full lg:w-6/12 px-4">
                            <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                              Email
                            </label>
                            <Field
                              type="text"
                              className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                              name="email"
                            />
                            {touched.email && errors.email && (
                              <div className="font-mono text-red-500">
                                {errors.email}
                              </div>
                            )}
                          </div>
                          {!isEdit && (
                            <div className="w-full lg:w-12/12 px-4 mt-8">
                              <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                                Password
                              </label>
                              <Field
                                type="password"
                                className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                name="password"
                              />
                              {touched.password && errors.password && (
                                <div className="font-mono text-red-500">
                                  {errors.password}
                                </div>
                              )}
                            </div>
                          )}
                          <div className="w-full lg:w-12/12 px-4 mt-8">
                            <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                              Role
                            </label>
                            <Field
                              className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                              name="role"
                              as="select"
                            >
                              <option selected value="GUEST">
                                Guest
                              </option>
                              <option value="ADMIN">Admin</option>
                            </Field>
                            {touched.role && errors.role && (
                              <div className="font-mono text-red-500">
                                {errors.role}
                              </div>
                            )}
                          </div>
                          <div className="w-full lg:w-6/12 px-4 mt-8">
                            <button
                              className="bg-indigo-600 float-right text-white font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                              type="submit"
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      </Form>
                    </div>
                  </div>
                </div>
              </>
            )}
          </Formik>
        </>
      )}
    </Layout>
  );
};

export default UserManager;
