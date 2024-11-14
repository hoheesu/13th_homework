// apollo-header-setting.ts
'use client';

import {
  ApolloClient,
  ApolloLink,
  ApolloProvider,
  fromPromise,
  InMemoryCache,
} from '@apollo/client';
import createUploadLink from 'apollo-upload-client/createUploadLink.mjs';
import { useEffect, useState } from 'react';
import { onError } from '@apollo/client/link/error';
import { reissueAccessToken } from '@/api/reissueAccessToken';

const DEFAULT_CACHE = new InMemoryCache();

interface IApolloSetting {
  children: React.ReactNode;
}
export default function ApolloSetting(props: IApolloSetting) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  if (typeof window === 'undefined') {
    // 이 코드는 서버에서만 실행됩니다.
    console.log('Server-side code');
  } else {
    // 이 코드는 클라이언트에서만 실행됩니다.
    console.log('Client-side code');
  }

  const errorLink = onError(({ graphQLErrors, operation, forward }) => {
    //
    // 1. 에러를 캐치
    if (typeof graphQLErrors !== 'undefined') {
      for (const err of graphQLErrors) {
        // 1-2. 해당 에러가 토큰만료 에러인지 체크(UNAUTHENTICATED)
        if (err.extensions?.code === 'UNAUTHENTICATED') {
          return fromPromise(
            // 2. refreshToken으로 accessToken을 재발급 받기
            reissueAccessToken().then((newAccessToken) => {
              // 3. 재발급 받은 accessToken으로 방금 실패한 쿼리의 정보 수정하고 재시도하기
              localStorage.setItem('accessToken', newAccessToken ?? '');

              operation.setContext({
                headers: {
                  ...operation.getContext().headers, // Authorization: Bearer qklqkjdkjafsklj => 만료된 토큰이 추가되어 있는 상태
                  Authorization: `Bearer ${newAccessToken ?? ''}`, // 3-2. 토큰만 새걸로 바꿔치기
                },
              });
            }),
          ).flatMap(() => forward(operation));
        }
      }
    }
  });

  // 클라이언트 측에서만 토큰을 가져오도록 useEffect 사용
  useEffect(() => {
    setAccessToken(window.localStorage.getItem('accessToken'));
  }, []);

  const uploadLink = createUploadLink({
    uri: 'http://main-practice.codebootcamp.co.kr/graphql',
    ...(accessToken
      ? { headers: { Authorization: `Bearer ${accessToken}` } }
      : {}),
    credentials: 'include',
  });

  const client = new ApolloClient({
    link: ApolloLink.from([errorLink, uploadLink]),
    cache: DEFAULT_CACHE,
  });

  return <ApolloProvider client={client}>{props.children}</ApolloProvider>;
}
