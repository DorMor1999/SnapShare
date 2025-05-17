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
  onClick?: () => void;
};

const MyButton: React.FC<MyButtonProps> = ({ text, type, variant, size, link, onClick}) => {
  return (
    <Button href={link} variant={variant} type={type} size={size} onClick={onClick}>{text}</Button>
  );
};

export default MyButton;