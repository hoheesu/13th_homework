import { gql } from '@apollo/client';

const LOGIN_USER = gql`
  mutation loginUser($password: String!, $email: String!) {
    loginUser(password: $password, email: $email) {
      accessToken
    }
  }
`;

const RESTORE_ACCESS_TOKEN = gql`
  mutation restoreAccessToken {
    restoreAccessToken {
      accessToken
    }
  }
`;
export { LOGIN_USER, RESTORE_ACCESS_TOKEN };
