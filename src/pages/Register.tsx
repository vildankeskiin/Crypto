import {Formik, Form, Field, ErrorMessage} from 'formik';
import * as Yup from 'yup';
import {useNavigate} from 'react-router-dom';
import { User } from '../models/User';

const Register = () => {

    const navigate = useNavigate();

    const initialValues: User = {
        name: '',
        surname: '',
        email: '',
        password: '',
    };
    
    const validationSchema = Yup.object({
        name: Yup.string().required('Required'),
        surname: Yup.string().required('Required'),
        email: Yup.string().email('Invalid email format').required('Required'),
        password: Yup.string().required('Required'),
    });

    const OnSubmit = (values: User) => {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        users.push(values);
        localStorage.setItem('users', JSON.stringify(users));
        console.log('User registered successfully');
        navigate('/Login');
    };


  return (
    <div className="auth-container">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={OnSubmit}
      >
        <Form className='form-group'>
          <h2>REGISTER</h2>
          <Field name='name' type='text' placeholder='Name' className='form-control' />
          <ErrorMessage name='name' component='div' className='alert alert-danger' />
          <Field name='surname' type='text' placeholder='Surname' className='form-control' />
          <ErrorMessage name='surname' component='div' className='alert alert-danger' />
          <Field name='email' type='email' placeholder='Email' className='form-control' />
          <ErrorMessage name='email' component='div' className='alert alert-danger' />
          <Field name='password' type='password' placeholder='Password' className='form-control' />
          <ErrorMessage name='password' component='div' className='alert alert-danger' />
          <div className='row'>
            <button type="submit" className="btn btn-primary">Register</button>
            <button type='button' className='btn btn-primary' onClick={() => navigate('/login')}>I've an account</button>
          </div>
        </Form>
      </Formik>
    </div>
  );
};

export default Register;
