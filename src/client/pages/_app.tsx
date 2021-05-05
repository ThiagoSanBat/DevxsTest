import React, { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Hydrate } from 'react-query/hydration';
import { AuthProvider } from '../lib/token';
import { ToastContainer } from 'react-toastify';

import 'tailwindcss/tailwind.css';
import 'react-toastify/dist/ReactToastify.css';
import './global.css';

export default function App({ Component, pageProps }) {
  const queryClientRef = React.useRef<QueryClient>();
  const [token, setToken] = useState<string>();

  useEffect(() => {
    const localStorageToken = sessionStorage.getItem('token');
    setToken(localStorageToken);
  }, [true]);

  if (!queryClientRef.current) {
    queryClientRef.current = new QueryClient();
  }

  return (
    <>
      <QueryClientProvider client={queryClientRef.current}>
        <Hydrate state={pageProps.dehydratedState}>
          <AuthProvider token={token} setToken={setToken}>
            <Component {...pageProps} />
          </AuthProvider>
        </Hydrate>
      </QueryClientProvider>
      <ToastContainer />
    </>
  );
}
