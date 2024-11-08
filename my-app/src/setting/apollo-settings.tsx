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
import Link from 'next/link';

import { onError } from '@apollo/client/link/error';
import { getAccessToken } from '@/api/getAccessToken';

interface IApolloSetting {
  children: React.ReactNode;
}

export default function ApolloSetting(props: IApolloSetting) {
  const [accessToken, setAccessToken] = useState('');

  const errorLink = onError(({ graphQLErrors, operation, forward }) => {
    // 1. 에러를 캐치
    if (typeof graphQLErrors !== 'undefined') {
      for (const err of graphQLErrors) {
        // 1-2. 해당 에러가 토큰만료 에러인지 체크(UNAUTHENTICATED)
        if (err.extensions?.code === 'UNAUTHENTICATED') {
          return fromPromise(
            getAccessToken().then((newAccessToken) => {
              // 3. 재발급 받은 accessToken으로 방금 실패한 쿼리의 정보 수정하고 재시도하기
              setAccessToken(newAccessToken ?? '');

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

  const uploadLink = createUploadLink({
    uri: 'https://main-practice.codebootcamp.co.kr/graphql',
    headers: { Authorization: `Bearer ${accessToken}` },
    credentials: 'include',
  });
  3;
  const client = new ApolloClient({
    link: ApolloLink.from([errorLink, uploadLink]),
    cache: GLOBAL_STATE,
  });

  return <ApolloProvider client={client}>{props.children}</ApolloProvider>;
}
