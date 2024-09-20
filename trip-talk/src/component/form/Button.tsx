import React, { ReactNode } from 'react';
import s from './Button.module.css';

interface ButtonPropsType {
  children: ReactNode;
  style: 'default' | 'primary';
  type?: 'submit' | 'reset' | 'button' | undefined;
  disabled?: boolean;
  onClickFnc?: () => void;
}
const buttonConfig = {
  default: 'border border-solid border-1px border-black',
  primary: 'bg-primary text-white',
};

const Button = ({ children, ...props }: ButtonPropsType) => {
  return (
    <>
      <button
        className={`${s.buttonS} ${buttonConfig[props.style]}`}
        type={props.type}
        disabled={props.disabled}>
        {children}
      </button>
    </>
  );
};

export default Button;
