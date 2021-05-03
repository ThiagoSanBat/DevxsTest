import { Handler, withIronSession } from 'next-iron-session';

export default function withSession(handler: Handler) {
  return withIronSession(handler, {
    password: process.env.APPLICATION_SECRET,
    cookieName: process.env.APPLICATION_COOKIE_NAME,
    cookieOptions: {
      // the next line allows to use the session in non-https environements like
      // Next.js dev mode (http://localhost:3000)
      secure: process.env.NODE_ENV === 'production',
    },
  });
}

export const getToken = () =>
  withSession(async function ({ req, res }) {
    const token = req.session.get('token');

    if (token === undefined) {
      res.setHeader('location', '/');
      res.statusCode = 302;
      res.end();
      return { props: {} };
    }

    return {
      props: { token },
    };
  });
