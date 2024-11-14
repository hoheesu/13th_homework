import { gql } from '@apollo/client';

const FETCH_BOARDS = gql`
  query fetchBoards(
    $search: String
    $page: Int
    $endDate: DateTime
    $startDate: DateTime
  ) {
    fetchBoards(
      search: $search
      page: $page
      endDate: $endDate
      startDate: $startDate
    ) {
      writer
      title
      contents
      _id
      createdAt
      updatedAt
    }
  }
`;

export { FETCH_BOARDS };
