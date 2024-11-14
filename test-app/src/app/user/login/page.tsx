'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { z } from 'zod';
import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '@/api/Mutation';

export const schema = z.object({
  userId: z.string().min(3, { message: '아이디를 입력해주세요.' }),
  pw: z.string().min(1, { message: '비밀번호를 입력해주세요.' }),
});

export default function page() {
  const { register, handleSubmit, formState } = useForm({
    resolver: zodResolver(schema), // Zod 스키마를 이용한 유효성 검사
    mode: 'onChange', // 입력할 때마다 유효성 검사를 실행
  });
  const [loginUser] = useMutation(LOGIN_USER);
  const onClickSubmit = async (loginInfo: any) => {
    const { data } = await loginUser({
      variables: {
        email: loginInfo.userId,
        password: loginInfo.pw,
      },
    });
    const { accessToken } = data.loginUser;

    localStorage.setItem('accessToken', accessToken);
  };

  return (
    <form
      className="w-[300px] flex flex-col"
      onSubmit={handleSubmit(onClickSubmit)}>
      <div>
        <label htmlFor="">아이디</label>
        <input type="text" {...register('userId')} />
        {typeof formState.errors.userId?.message === 'string' && (
          <p className="text-[red]">{formState.errors.userId.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="">비밀번호</label>
        <input type="text" {...register('pw')} />
        {typeof formState.errors.pw?.message === 'string' && (
          <p className="text-[red]">{formState.errors.pw.message}</p>
        )}
      </div>
      <button type="submit">LOGIN</button>
    </form>
  );
}
