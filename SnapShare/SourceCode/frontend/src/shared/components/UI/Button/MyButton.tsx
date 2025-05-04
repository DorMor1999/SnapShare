// libary imports
import React from 'react';

// bootstrap imports
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router';

type MyButtonProps = {
  text: string;
  type: "button" | "reset" | "submit";
  variant: string;
  size: "lg" | "sm" | undefined;
  link?: string;
};

const MyButton: React.FC<MyButtonProps> = ({ text, type, variant, size, link}) => {
  return (
    <Button href={link} variant={variant} type={type} size={size}>{text}</Button>
  );
};

export default MyButton;