import { GraphQLClient } from 'graphql-request';
import { RESTORE_ACCESS_TOKEN } from './Mutation';

type RestoreAccessTokenResponse = {
  restoreAccessToken: {
    accessToken: string;
  };
};

export const reissueAccessToken = async () => {
  try {
    console.log('reissueAccessToken');
    const graphQLClient = new GraphQLClient(
      'https://main-practice.codebootcamp.co.kr/graphql',
      {
        credentials: 'include',
      },
    );
    const result = await graphQLClient.request<RestoreAccessTokenResponse>(
      RESTORE_ACCESS_TOKEN,
    );
    const newAccessToken = result?.restoreAccessToken.accessToken;
    return newAccessToken;
  } catch (error) {
    if (error instanceof Error) console.log(error.message);
  }
};
