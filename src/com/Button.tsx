import React from "react";

const Button: React.FC<{
  onClick: () => void;
  className: string;
  children?: React.ReactNode;
}> = (props) => {
  return (
    <button className={props.className} onClick={props.onClick}>
     {props.children}
    </button>
  );
};
export default Button;
