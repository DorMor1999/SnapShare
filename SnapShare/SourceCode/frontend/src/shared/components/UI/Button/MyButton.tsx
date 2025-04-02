// libary imports
import React from 'react';

// bootstrap imports
import Button from 'react-bootstrap/Button';

type MyButtonProps = {
  text: string;
  type: "button" | "reset" | "submit";
  variant: string;
  size: "lg" | "sm";
};

const MyButton: React.FC<MyButtonProps> = ({ text, type, variant, size}) => {
  return (
    <Button variant={variant} type={type} size={size}>{text}</Button>
  );
};

export default MyButton;