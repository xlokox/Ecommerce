import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { admin_login, messageClear, get_user_info, clearAuth } from '../../store/Reducers/authReducer';
import { PropagateLoader } from 'react-spinners';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {loader, errorMessage, successMessage, token, role} = useSelector(state=>state.auth)

    const [state, setState] = useState({
        email: "",
        password: ""
    })

    const inputHandle = (e) => {
        setState({
            ...state,
            [e.target.name] : e.target.value
        })
    }

    const submit = (e) => {
        e.preventDefault()
        dispatch(admin_login(state))
        // console.log(state)
    }

    const overrideStyle = {
        display : 'flex',
        margin : '0 auto',
        height: '24px',
        justifyContent : 'center',
        alignItems : 'center'
    }

    // Effect for handling token and role
    useEffect(() => {
        try {
            // If we have a role, redirect to the appropriate dashboard
            if (role === 'admin') {
                navigate('/admin/dashboard');
            }
            // Only fetch user info if we have a token but no role
            else if (token && !role) {
                dispatch(get_user_info());
            }
        } catch (error) {
            console.error('Error in AdminLogin token/role effect:', error);
        }
    }, [token, role, dispatch, navigate]);

    // Separate effect for handling success messages
    useEffect(() => {
        try {
            if (successMessage) {
                toast.success(successMessage);
                dispatch(messageClear());
            }
        } catch (error) {
            console.error('Error in AdminLogin success message effect:', error);
        }
    }, [successMessage, dispatch]);

    // Separate effect for handling error messages
    useEffect(() => {
        try {
            if (errorMessage) {
                toast.error(errorMessage);
                dispatch(messageClear());
                // Clear auth state if there's an error with authentication
                if (errorMessage.includes('authentication') || errorMessage.includes('token')) {
                    dispatch(clearAuth());
                }
            }
        } catch (error) {
            console.error('Error in AdminLogin error message effect:', error);
            toast.error('An error occurred. Please try again.');
        }
    }, [errorMessage, dispatch])

    return (
        <div className='min-w-screen min-h-screen bg-[#cdcae9] flex justify-center items-center' >
          <div className='w-[350px] text-[#ffffff] p-2'>
            <div className='bg-[#6f68d1] p-4 rounded-md'>

        <div className='h-[70px] flex justify-center items-center'>
            <div className='w-[180px] h-[50px]'>
                <img className='w-full h-full' src="http://localhost:3000/images/logo.png" alt="image" />
            </div>
            </div>

    <form onSubmit={submit}>

        <div className='flex flex-col w-full gap-1 mb-3'>
            <label htmlFor="email">Email</label>
            <input onChange={inputHandle} value={state.email}  className='px-3 py-2 outline-none border border-slate-400 bg-transparent rounded-md' type="email" name='email' placeholder='Email' id='email' required />

        </div>

        <div className='flex flex-col w-full gap-1 mb-3'>
            <label htmlFor="password">Password</label>
            <input onChange={inputHandle} value={state.password}  className='px-3 py-2 outline-none border border-slate-400 bg-transparent rounded-md' type="password" name='password' placeholder='Password' id='password' required />
        </div>


        <button disabled={loader ? true : false}  className='bg-slate-800 w-full hover:shadow-blue-300/ hover:shadow-lg text-white rounded-md px-7 py-2 mb-3'>
            {
               loader ? <PropagateLoader color='#fff' cssOverride={overrideStyle} /> : 'Login'
            }
            </button>

    </form>

            </div>
            </div>

        </div>
    );
};

export default AdminLogin;