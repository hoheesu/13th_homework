'use client';
import { FETCH_BOARDS } from '@/api/Query';
import { useQuery } from '@apollo/client';
import { ChangeEvent, useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { debounce } from 'lodash';
import dateFormatter from '@/common/utils/dateFormatter';
import { DatePicker } from 'antd';
import dayjs, { Dayjs } from 'dayjs';

export default function page() {
  const [hasMore, setHasMore] = useState(true);
  const [searchValue, setSearchValue] = useState('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  // const [date, setDate] = useState(new Date());

  const { RangePicker } = DatePicker;

  const { data, fetchMore } = useQuery(FETCH_BOARDS, {
    variables: {
      search: searchValue,
      startDate: startDate || null,
      endDate: endDate || null,
    },
    fetchPolicy: 'no-cache',
  });

  const onNext = () => {
    if (data?.fetchBoards.legnth < 9) {
      setHasMore(false);
      return;
    }
    if (!data) {
      return;
    }

    fetchMore({
      variables: {
        page: Math.ceil(data?.fetchBoards.length / 10) + 1,
      },

      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult || fetchMoreResult.fetchBoards.length < 9) {
          setHasMore(false);
          return {
            fetchBoards: [...prev.fetchBoards, ...fetchMoreResult.fetchBoards],
          };
        }

        return {
          fetchBoards: [...prev.fetchBoards, ...fetchMoreResult.fetchBoards],
        };
      },
    });
  };

  const onChangeBoardsSearch = debounce(
    (event: ChangeEvent<HTMLInputElement>) => {
      console.log(
        `%c${event.target.value}`,
        `font-weight: bold; font-size: 50px; color: #ff629C; text-shadow: 3px 3px 5px rgb(255, 100, 150), 6px 6px 2px rgb(255, 255, 255), 9px 9px 5px rgb(254, 221, 8), 12px 12px 2px rgb(255, 255, 255), 15px 15px 5px rgb(2, 135, 206), 18px 18px 2px rgb(255, 255, 255), 21px 21px 5px rgb(42, 21, 113)`,
      );
      setSearchValue(event.target.value);
      setHasMore(true);
    },
    500,
  );

  const onChangeBoardsDate = debounce(
    (dates: unknown, dateString: string[]) => {
      console.log(
        `%c${dateString}`,
        `background-color: black; color: white;`,
        dates,
      );

      setStartDate(dateString[0]);
      setEndDate(dateString[1]);
      setHasMore(true);
    },
    500,
  );

  return (
    <>
      <input
        type="text"
        className="border-2 border-[#ccc] text-[#333]"
        onChange={onChangeBoardsSearch}
      />
      <RangePicker maxDate={dayjs()} onChange={onChangeBoardsDate} />
      <div id="scrollableDiv" className="h-[200px] bg-[#ddd] overflow-y-scroll">
        <InfiniteScroll
          dataLength={data?.fetchBoards.length ?? 0}
          next={onNext}
          hasMore={hasMore}
          loader={<h4>Loading...</h4>}
          scrollableTarget="scrollableDiv">
          {data &&
            data?.fetchBoards.map((el: IFetchBoardsResult, index: number) => {
              return (
                <div key={el._id + index} className="flex gap-4">
                  <p className="text-[#333] w-[100px] overflow-hidden">
                    {el.title}
                  </p>
                  <p className="text-[#333] w-[200px] overflow-hidden">
                    {el.contents}
                  </p>
                  <p className="text-[#333] w-[50px] overflow-hidden">
                    {el.writer}
                  </p>
                </div>
              );
            })}
        </InfiniteScroll>
      </div>
    </>
  );
}
