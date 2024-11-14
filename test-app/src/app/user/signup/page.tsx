import React from 'react';

export default function page() {
  if (typeof window === 'undefined') {
    // 이 코드는 서버에서만 실행됩니다.
    console.log('Server-side code');
  } else {
    // 이 코드는 클라이언트에서만 실행됩니다.
    console.log('Client-side code');
  }

  return <div>page</div>;
}
