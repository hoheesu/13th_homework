'use client';

import React from 'react';
import * as PortOne from '@portone/browser-sdk/v2';
import { gql, useMutation } from '@apollo/client';

const CREATE_POINT_TRANSACTION_OF_LOADING = gql`
  mutation createPointTransactionOfLoading($paymentId: ID!) {
    createPointTransactionOfLoading(paymentId: $paymentId) {
      _id
      amount
      balance
      status
    }
  }
`;

export default function page() {
  const [createPointTransactionOfLoading] = useMutation(
    CREATE_POINT_TRANSACTION_OF_LOADING,
  );

  const onClickPayment = async () => {
    try {
      const rsp = await PortOne.requestPayment({
        storeId: 'store-2f095073-83f5-4308-b9f9-4215bf469c3d',
        paymentId: crypto.randomUUID(),
        // paymentId: '6735b1579712e0002973f5f2',
        orderName: '잠실 시그니엘',
        totalAmount: 3000000,
        currency: 'CURRENCY_KRW',
        channelKey: 'channel-key-e00372ce-68a6-446e-8bda-56d5e187b046',
        payMethod: 'EASY_PAY',
        customer: {
          fullName: '윤준수',
          phoneNumber: '010-1234-5678',
          email: 'asfd@gmail.com',
          address: {
            country: 'COUNTRY_KR',
            addressLine1: '잠실동',
            addressLine2: '시그니엘',
            city: '송파구',
            province: '서울특별시',
          },
          zipcode: '05551',
        },
        redirectUrl: 'http://localhost:3000/portone',
      });
      // 결제 성공 시 로직,
      console.log(rsp?.paymentId);
      const response = await createPointTransactionOfLoading({
        variables: {
          paymentId: rsp?.paymentId,
        },
      });
      console.log(response.data);
    } catch (error) {
      // 결제 실패 시 로직,
      console.error(error);
    }
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <button onClick={onClickPayment}>포트원 결제하기</button>
    </div>
  );
}
