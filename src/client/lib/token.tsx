import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import Router from 'next/router';
import React from 'react';
import axios, { AxiosError } from 'axios';
import jwt_decode from 'jwt-decode';

export type UserProps = {
  redirectTo?: string;
  redirectIfFound?: boolean;
  token?: string;
  setToken?: React.Dispatch<React.SetStateAction<string>>;
};

export enum SubscriptionLevelEnum {
  Guest = 'GUEST',
  Admin = 'ADMIN',
}

export interface UserAuthenticated {
  id?: number;
  email?: string;
  name?: string;
  role?: SubscriptionLevelEnum;
}

type AuthContext = {
  accessToken?: string;
  setAccessToken: Dispatch<SetStateAction<string>>;
  userAuthenticated?: UserAuthenticated;
  setUserAuthenticated: Dispatch<SetStateAction<UserAuthenticated>>;
  setToken: React.Dispatch<React.SetStateAction<string>>;
};

export const AuthContext = React.createContext<Partial<AuthContext>>({});

export const AuthProvider: React.FC<UserProps> = ({
  children,
  token,
  setToken,
}) => {
  const [accessToken, setAccessToken] = useState<string>();
  const [
    userAuthenticated,
    setUserAuthenticated,
  ] = useState<UserAuthenticated>();

  if (accessToken == undefined && accessToken != token) {
    setUserAuthenticated(jwt_decode(token) as UserAuthenticated);
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
        sessionStorage.removeItem('token');
        Router.push('/', '/', { locale: '/' });
      }
      return Promise.reject(err);
    },
  );

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        setAccessToken,
        userAuthenticated,
        setUserAuthenticated,
        setToken,
      }}
    >
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
    if (accessToken) {
      sessionStorage.setItem('token', accessToken);
    } else {
      sessionStorage.removeItem('token');
    }

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
