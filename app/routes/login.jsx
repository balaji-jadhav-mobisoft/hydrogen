import {useState} from 'react';
import {useFetcher} from '@remix-run/react';

import {
  createCookieSessionStorage,
  json,
  redirect,
} from '@shopify/remix-oxygen';

export async function action({request}) {
  // Your existing action code
  const {email, password} = Object.fromEntries(await request.formData());
  console.log(email, 'email');
  console.log(password, 'password');

  const response = await fetch(
    'https://b78cdc-dc.myshopify.com/api/2023-01/graphql.json',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': '14d1783abe0e46750d89525a8a6241cb',
      },
      body: JSON.stringify({
        query: `
          mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
            customerAccessTokenCreate(input: $input) {
              customerAccessToken {
                accessToken
                expiresAt
              }
              userErrors {
                field
                message
              }
            }
          }
        `,
        variables: {
          input: {email, password},
        },
      }),
    },
  );

  if (!response.ok) {
    const text = await response.text();
    console.error('Non-JSON response received:', text);
    return json({error: 'Internal server error'}, {status: 500});
  }

  let data;
  try {
    data = await response.json();
  } catch (error) {
    const text = await response.text();
    console.error('Failed to parse JSON:', text);
    return json({error: 'Failed to parse server response'}, {status: 500});
  }

  console.log(data.data, 'data');

  if (data.errors || data.data.customerAccessTokenCreate.userErrors.length) {
    console.error(
      'Error occurred:',
      data.errors || data.data.customerAccessTokenCreate.userErrors,
    );
    return json({error: 'Invalid credentials'}, {status: 400});
  } else {
    const {accessToken} =
      data.data.customerAccessTokenCreate.customerAccessToken;
    console.log(accessToken, 'accessToken');

    const storage = createCookieSessionStorage({
      cookie: {
        name: 'session',
        secure: process.env.NODE_ENV === 'production',
        secrets: ['09b468cf8224b7fba14d3cc7a4432b5dce6cfa09'],
        sameSite: 'lax',
        path: '/',
        httpOnly: true,
      },
    });

    const session = await storage.getSession(request.headers.get('Cookie'));
    session.set('accessToken', accessToken);

    const headers = new Headers();
    headers.append('Set-Cookie', await storage.commitSession(session));

    return redirect('/account', {headers});
  }
}

export default function Login() {
  const fetcher = useFetcher();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    fetcher.submit({email, password}, {method: 'post', action: '/login'});
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Login</button>
      </form>
      {fetcher.data && fetcher.data.error && <p>{fetcher.data.error}</p>}
    </div>
  );
}
