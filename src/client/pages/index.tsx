import React, { useState } from 'react';
import { NextComponentType, NextPage } from 'next';
import { Formik, Form, Field } from 'formik';
import axios, { AxiosError } from 'axios';
import { object, string } from 'yup';
import { toast, TypeOptions } from 'react-toastify';
import useUser from '../lib/token';

const getErrorOrDefault = (defaultMessage: string) => (err: AxiosError) =>
  err?.response?.data?.message || defaultMessage;

const ModalEmailNotification: NextComponentType<
  {},
  {},
  {
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  }
> = ({ setShowModal }) => {
  return (
    <div
      className="fixed z-10 inset-0 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
        ></div>

        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg
                  className="h-6 w-6 text-red-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3
                  className="text-lg leading-6 font-medium text-gray-900"
                  id="modal-title"
                >
                  Dexs E-commercer
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    An email to verify your account was sent, please check your
                    email!
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Login: NextPage = () => {
  const DEFAULT_ERROR_MSG =
    'Sorry, something went wrong. Please try again later!';

  const [isSignIn, seIsSignIn] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [_, setAccessToken] = useUser({
    redirectIfFound: true,
    redirectTo: '/product',
  });

  const signIn = (password: string, email: string) =>
    axios
      .post('/auth/signin', { password, email })
      .then((res) => setAccessToken(res.data.accessToken))
      .catch((err: AxiosError) => {
        let message = '';
        let level: TypeOptions = 'error';
        let isEmailNotActivated = false;
        if (err.response.status === 400) {
          message =
            'It seems that you didn´t verified your email yet. Please click here to send a new validation email.';
          level = 'warning';
          isEmailNotActivated = true;
        } else {
          message = getErrorOrDefault(DEFAULT_ERROR_MSG)(err);
        }
        toast(message, {
          type: level,
          onClick: () =>
            isEmailNotActivated
              ? handleSendVerifyEmailAgain(email, password)
              : {},
        });
      });

  const handleSendVerifyEmailAgain = (email: string, password: string) => {
    axios
      .post('/email/retrieve-email', { email })
      .then(() => setShowModal(true))
      .catch((err: AxiosError) =>
        toast(getErrorOrDefault(DEFAULT_ERROR_MSG)(err), {
          type: 'error',
        }),
      );
  };

  const signUp = (password: string, email: string, name: string) =>
    axios
      .post('/auth/signup', { password, email, name })
      .then(() => {
        setShowModal(true), seIsSignIn(true);
      })
      .catch((err: AxiosError) =>
        toast(
          getErrorOrDefault(
            "Sorry, something went wrong, we can't create your account!",
          )(err),
          {
            type: 'error',
          },
        ),
      );

  const SigninSchema = object().shape({
    email: string().required('Email is required').email('Invalid Email'),
    password: string().required('Password is required'),
  });

  const SignupSchema = object().shape({
    email: string().required('Email is required').email('Invalid Email'),
    password: string().required('Password is required'),
    name: string().required('Name is required'),
  });

  return (
    <>
      {showModal && <ModalEmailNotification setShowModal={setShowModal} />}
      <div className="h-screen bg-white flex flex-col space-y-10 justify-center items-center">
        <div className="bg-white w-96 shadow-xl rounded p-5">
          <div className="bg-white dark:bg-gray-800 ">
            <div className="text-center w-full mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 z-20">
              <h2 className="text-3xl font-extrabold text-black dark:text-white sm:text-4xl">
                <span className="block">Devx</span>
                <span className="block text-indigo-500">E-Commerce</span>
              </h2>
              <div className="lg:mt-0 lg:flex-shrink-0"></div>
            </div>
          </div>
          <Formik
            initialValues={{ email: '', password: '', name: '' }}
            validationSchema={isSignIn ? SigninSchema : SignupSchema}
            onSubmit={(values) =>
              isSignIn
                ? signIn(values.password, values.email)
                : signUp(values.password, values.email, values.name)
            }
          >
            {({ errors, touched }) => (
              <Form className="space-y-5 mt-5">
                {!isSignIn && (
                  <>
                    <Field
                      type="text"
                      className="w-full h-12 border border-gray-800 rounded px-3"
                      name="name"
                      placeholder="Name"
                    />
                    {touched.name && errors.name && (
                      <div className="font-mono text-red-500">
                        {errors.name}
                      </div>
                    )}
                  </>
                )}
                <Field
                  type="text"
                  className="w-full h-12 border border-gray-800 rounded px-3"
                  name="email"
                  placeholder="Email"
                />
                {touched.email && errors.email && (
                  <div className="font-mono text-red-500">{errors.email}</div>
                )}
                <Field
                  type="password"
                  className="w-full h-12 border border-gray-800 rounded px-3"
                  name="password"
                  placeholder="Password"
                />
                {touched.password && errors.password && (
                  <div className="font-mono text-red-500">
                    {errors.password}
                  </div>
                )}
                <div className="">
                  <a
                    href="#"
                    onClick={() => seIsSignIn((prev) => !prev)}
                    className="font-medium text-indigo-500  rounded-md p-2"
                  >
                    {isSignIn ? 'Signup' : 'Signin'}
                  </a>
                </div>

                <button
                  className="text-center w-full bg-indigo-900 rounded-md text-white py-3 font-medium"
                  type="submit"
                >
                  {isSignIn ? 'Signin' : 'Signup'}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
};

export default Login;
