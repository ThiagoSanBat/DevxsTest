import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import Router from 'next/router';
import React from 'react';
import axios, { AxiosError } from 'axios';

export type UserProps = {
  redirectTo?: string;
  redirectIfFound?: boolean;
  token?: string;
};

type AuthContext = {
  accessToken?: string;
  setAccessToken: Dispatch<SetStateAction<string>>;
};

const AuthContext = React.createContext<Partial<AuthContext>>({});

export const AuthProvider: React.FC<UserProps> = ({ children, token }) => {
  const [accessToken, setAccessToken] = useState<string>();

  if (accessToken == undefined && accessToken != token) {
    setAccessToken(token);
  }

  const getToken = () => `Bearer ${accessToken}`;

  axios.interceptors.request.use(
    (config) => {
      if (!!accessToken) {
        config.headers.Authorization = getToken();
      }
      return config;
    },
    (error) => {
      Promise.reject(error);
    },
  );

  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    (err: AxiosError) => {
      if (err.response.status == 401) {
        Router.push('/', '/', { locale: '/' });
      }
      return Promise.reject(err);
    },
  );

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export default function useUser({
  redirectTo = undefined,
  redirectIfFound = false,
}: UserProps = {}): [string, Dispatch<SetStateAction<string>>] {
  const { accessToken, setAccessToken } = React.useContext(AuthContext);

  useEffect(() => {
    // if no redirect needed, just return (example: already on /home)
    // if user data not yet there (fetch in progress, logged in or not) then don't do anything yet
    if (!redirectTo || !accessToken) return;

    if (
      // If redirectTo is set, redirect if the user was not found.
      (redirectTo && !redirectIfFound && !accessToken) ||
      // If redirectIfFound is also set, redirect if the user was found
      (redirectIfFound && accessToken)
    ) {
      Router.push(redirectTo);
    }
  }, [accessToken, redirectIfFound, redirectTo]);

  return [accessToken, setAccessToken];
}
