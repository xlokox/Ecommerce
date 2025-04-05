import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { seller_login, messageClear } from '../../store/Reducers/authReducer';
import toast from 'react-hot-toast';

const SellerLogin = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loader, errorMessage, successMessage, role } = useSelector(state => state.auth);

    const [state, setState] = useState({
        email: '',
        password: ''
    });

    const inputHandle = (e) => {
        setState({
            ...state,
            [e.target.name]: e.target.value
        });
    };

    const submit = (e) => {
        e.preventDefault();
        dispatch(seller_login(state));
    };

    // Use a state to track if we've already shown the success message
    const [hasShownSuccessMessage, setHasShownSuccessMessage] = useState(false);
    const [hasRedirected, setHasRedirected] = useState(false);

    useEffect(() => {
        if (errorMessage) {
            toast.error(errorMessage);
            dispatch(messageClear());
        }
        if (successMessage && !hasShownSuccessMessage) {
            toast.success(successMessage);
            dispatch(messageClear());
            setHasShownSuccessMessage(true);

            // Redirect based on role
            if (role === 'seller') {
                navigate('/seller/dashboard', { replace: true });
            } else if (role === 'admin') {
                navigate('/admin/dashboard', { replace: true });
            } else {
                navigate('/', { replace: true });
            }
        }
        // If already logged in as seller, redirect to dashboard
        else if (role === 'seller' && !hasRedirected) {
            setHasRedirected(true);
            navigate('/seller/dashboard', { replace: true });
        }
    }, [errorMessage, successMessage, role, dispatch, navigate, hasShownSuccessMessage, hasRedirected]);

    return (
        <div className="min-w-screen min-h-screen bg-[#161d31] flex justify-center items-center">
            <div className="w-[350px] text-[#d0d2d6] p-2">
                <div className="bg-[#283046] p-4 rounded-md">
                    <h2 className="text-xl font-bold text-center">Seller Login</h2>
                    <form onSubmit={submit}>
                        <div className="flex flex-col w-full gap-1 mb-3">
                            <label htmlFor="email">Email</label>
                            <input
                                onChange={inputHandle}
                                value={state.email}
                                className="px-3 py-2 outline-none border border-slate-700 bg-transparent rounded-md text-[#d0d2d6] focus:border-indigo-500"
                                type="email"
                                name="email"
                                placeholder="Email"
                                id="email"
                                required
                            />
                        </div>
                        <div className="flex flex-col w-full gap-1 mb-5">
                            <label htmlFor="password">Password</label>
                            <input
                                onChange={inputHandle}
                                value={state.password}
                                className="px-3 py-2 outline-none border border-slate-700 bg-transparent rounded-md text-[#d0d2d6] focus:border-indigo-500"
                                type="password"
                                name="password"
                                placeholder="Password"
                                id="password"
                                required
                            />
                        </div>
                        <button
                            disabled={loader}
                            className="bg-blue-500 w-full hover:shadow-blue-500/50 hover:shadow-lg text-white rounded-md px-7 py-2 mb-3"
                        >
                            {loader ? 'Loading...' : 'Login'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SellerLogin;
