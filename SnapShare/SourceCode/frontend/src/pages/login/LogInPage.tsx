// react imports
import React from 'react';


//my imports
import Wrapper from '../../shared/components/UI/Wrapper/Wrapper';
import BoxForm from '../../shared/components/UI/BoxForm/BoxForm';
import Input from '../../shared/components/UI/Input/Input';


const LogInPage: React.FC = () => {
  

  return (
    <Wrapper>
        <BoxForm>
            <h1>LogIn</h1>
            <Input label='Email' type='email'/>
            <Input label='Password' type='password'/>
            

        </BoxForm>
    </Wrapper>
  );
};

export default LogInPage;