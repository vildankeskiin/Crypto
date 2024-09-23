import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import './Auth.css';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginSuccess, setLoginSuccess] = useState<string | null>(null);

  const initialValues = {
    email: '',
    password: '',
  };

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Required'),
    password: Yup.string().required('Required'),
  });

  const onSubmit = (values: { email: string; password: string; }) => {
    const registeredUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const user = registeredUsers.find((
        user: { email: string; password: string; }) => 
        user.email === values.email &&
        user.password === values.password);

    if (!user) {
      setLoginError('Invalid email or password');
      setLoginSuccess(null);
    } else {
      setLoginError(null);
      setLoginSuccess('Login successful');
      localStorage.setItem('currentUser', JSON.stringify(user));
      console.log('Login successful');
      navigate('/home'); 
    }
  };

  return (
    <div className='auth-container'>
      <Formik 
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        <Form className='form-group'>
          <h2>LOGIN</h2>
          <Field name='email' type='email' placeholder='Email' className='form-control' />
          <ErrorMessage name='email' component='div' className='alert alert-danger' />
          <Field name='password' type='password' placeholder='Password' className='form-control' />
          <ErrorMessage name='password' component='div' className='alert alert-danger' />
          <div className='row'>
            <button type='submit' className='btn btn-primary' >Login</button>
            <button type='button' className='btn btn-primary' onClick={() => navigate('/register')}>I'm new here</button>
          </div>
          {loginError && <div className='alert alert-danger'>{loginError}</div>}
          {loginSuccess && <div className="alert alert-success">{loginSuccess}</div>}
        </Form>
      </Formik>
    </div>
  );
}

export default Login;
