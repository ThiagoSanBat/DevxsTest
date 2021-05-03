import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Hydrate } from 'react-query/hydration';
import { AuthProvider } from '../lib/token';
import { ToastContainer } from 'react-toastify';

import 'tailwindcss/tailwind.css';
import 'react-toastify/dist/ReactToastify.css';

export default function App({ Component, pageProps }) {
  const queryClientRef = React.useRef<QueryClient>();

  if (!queryClientRef.current) {
    queryClientRef.current = new QueryClient();
  }

  return (
    <>
      <QueryClientProvider client={queryClientRef.current}>
        <Hydrate state={pageProps.dehydratedState}>
          <AuthProvider token={pageProps.token}>
            <Component {...pageProps} />
          </AuthProvider>
        </Hydrate>
      </QueryClientProvider>
      <ToastContainer />
    </>
  );
}
