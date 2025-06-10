import React, { useEffect, useRef, useState } from 'react';
import { FaList, FaPaperPlane, FaUser, FaCircle } from 'react-icons/fa6';
import { IoMdClose, IoMdSend } from "react-icons/io";
import { BsEmojiSmile, BsCheck2All, BsCheck2 } from "react-icons/bs";
import { useDispatch, useSelector } from 'react-redux';
import { get_customer_message, get_customers,messageClear,send_message,updateMessage } from '../../store/Reducers/chatReducer';
import { Link, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

import { socket } from '../../utils/utils';

const SellerToCustomer = () => {

    const scrollRef = useRef()

    const [show, setShow] = useState(false)
    const {userInfo } = useSelector(state => state.auth)
    const {customers,messages,currentCustomer,successMessage,activeCustomer } = useSelector(state => state.chat)
    const [text,setText] = useState('')
    const [receverMessage,setReceverMessage] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const [onlineUsers, setOnlineUsers] = useState([])

    const { customerId } =  useParams()

    const dispatch = useDispatch()

    // 🚀 Enhanced Socket Event Handlers
    useEffect(() => {
        if (userInfo?._id) {
            socket.emit('add_seller', userInfo._id, userInfo);
            console.log('🔗 Seller connected to socket:', userInfo._id);
        }
    }, [userInfo]);

    useEffect(() => {
        socket.on('customer_message', (msg) => {
            console.log('📨 Received customer message:', msg);
            setReceverMessage(msg);
        });

        socket.on('activeSeller', (sellers) => {
            setOnlineUsers(sellers);
        });

        socket.on('typing', (data) => {
            if (data.senderId === customerId) {
                setIsTyping(true);
                setTimeout(() => setIsTyping(false), 3000);
            }
        });

        return () => {
            socket.off('customer_message');
            socket.off('activeSeller');
            socket.off('typing');
        };
    }, [customerId]);

    useEffect(() => {
        dispatch(get_customers(userInfo._id))
    },[])

    useEffect(() => {
        if (customerId) {
            dispatch(get_customer_message(customerId))
        }
    },[customerId])

    // Removed duplicate send function - using enhanced version below
 
    useEffect(() => {
        if (successMessage) {
            socket.emit('send_seller_message',messages[messages.length - 1])
            dispatch(messageClear())
        }
    },[successMessage])

    useEffect(() => {
        socket.on('customer_message', msg => {
            setReceverMessage(msg)
        })
         
    },[])

    useEffect(() => {
        if (receverMessage) {
            if (customerId === receverMessage.senderId && userInfo._id === receverMessage.receverId) {
                dispatch(updateMessage(receverMessage))
            } else {
                toast.success(receverMessage.senderName + " " + "Send A message")
                dispatch(messageClear())
            }
        }

    },[receverMessage])

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth'})
    },[messages])

    // 🚀 Enhanced Send Message Function
    const send = (e) => {
        e.preventDefault();
        if (text.trim()) {
            const messageData = {
                senderId: userInfo._id,
                receverId: customerId,
                text: text.trim(),
                name: userInfo?.shopInfo?.shopName || userInfo?.name,
                timestamp: new Date().toISOString()
            };

            console.log('📤 Seller sending message:', messageData);
            dispatch(send_message(messageData));
            setText('');

            // Stop typing indicator
            socket.emit('typing', {
                senderId: userInfo._id,
                receiverId: customerId,
                typing: false
            });
        }
    };

    // 🎯 Handle Enter Key Press
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            send(e);
        }
    };

    // 🔤 Handle Typing Indicator
    const handleTyping = (value) => {
        setText(value);

        if (value.trim()) {
            socket.emit('typing', {
                senderId: userInfo._id,
                receiverId: customerId,
                typing: true
            });
        } else {
            socket.emit('typing', {
                senderId: userInfo._id,
                receiverId: customerId,
                typing: false
            });
        }
    };

    return (
    <div className='px-2 lg:px-7 py-5'>
        <div className='w-full bg-[#6a5fdf] px-4 py-4 rounded-md h-[calc(100vh-140px)]'>
        <div className='flex w-full h-full relative'>
    
    <div className={`w-[280px] h-full absolute z-10 ${show ? '-left-[16px]' : '-left-[336px]'} md:left-0 md:relative transition-all `}>
        <div className='w-full h-[calc(100vh-177px)] bg-[#9e97e9] md:bg-transparent overflow-y-auto'>
        <div className='flex text-xl justify-between items-center p-4 md:p-0 md:px-3 md:pb-3 text-white'>
        <h2>Customers</h2>
        <span onClick={() => setShow(!show)} className='block cursor-pointer md:hidden'><IoMdClose /> </span>
       </div>


        {
            customers.map((c,i) => {
                const isOnline = onlineUsers.some(user => user.userId === c.fdId);
                const isActive = customerId === c.fdId;

                return (
                    <Link
                        key={i}
                        to={`/seller/dashboard/chat-customer/${c.fdId}`}
                        className={`h-[70px] flex justify-start gap-3 items-center text-white px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 mb-2 ${
                            isActive ? 'bg-[#6366f1] shadow-lg' : 'bg-[#8288ed] hover:bg-[#7c83ea]'
                        }`}
                    >
                        <div className='relative'>
                            <img className='w-[45px] h-[45px] border-white border-2 max-w-[45px] p-[2px] rounded-full' src="http://localhost:3001/images/admin.jpg" alt="" />
                            <div className={`w-[12px] h-[12px] ${isOnline ? 'bg-green-500' : 'bg-gray-500'} rounded-full absolute right-0 bottom-0 border-2 border-white`}></div>
                        </div>

                        <div className='flex justify-center items-start flex-col w-full'>
                            <div className='flex justify-between items-center w-full'>
                                <h2 className='text-base font-semibold'>{c.name}</h2>
                                {isOnline && <FaCircle className='text-green-400 text-xs' />}
                            </div>
                            <div className='flex items-center gap-2 mt-1'>
                                <span className='text-xs text-gray-200'>
                                    {isOnline ? 'Online' : 'Offline'}
                                </span>
                                {c.lastMessage && (
                                    <span className='text-xs text-gray-300 truncate max-w-[120px]'>
                                        {c.lastMessage}
                                    </span>
                                )}
                            </div>
                        </div>
                    </Link>
                )
            })
        }
       


      

 
 

        </div> 
    </div>

    <div className='w-full md:w-[calc(100%-200px)] md:pl-4'>
        <div className='flex justify-between items-center'>
            {
                customerId && <div className='flex justify-start items-center gap-3'>
           <div className='relative'>
         <img className='w-[45px] h-[45px] border-green-500 border-2 max-w-[45px] p-[2px] rounded-full' src="http://localhost:3001/images/demo.jpg" alt="" />
         <div className='w-[10px] h-[10px] bg-green-500 rounded-full absolute right-0 bottom-0'></div>
        </div>
        <h2 className='text-base text-white font-semibold'>{currentCustomer.name}</h2>

                </div>
            } 

            <div onClick={()=> setShow(!show)} className='w-[35px] flex md:hidden h-[35px] rounded-sm bg-blue-500 shadow-lg hover:shadow-blue-500/50 justify-center cursor-pointer items-center text-white'>
                <span><FaList/> </span>
            </div> 
        </div>

        <div className='py-4'>
            <div className='bg-[#475569] h-[calc(100vh-290px)] rounded-md p-3 overflow-y-auto'>

    {
        customerId ? messages.map((m,i) => {
            if (m.senderId === customerId) {
                return (
                    <div key={i} ref={scrollRef} className='w-full flex justify-start items-center mb-3'>
                    <div className='flex justify-start items-start gap-2 md:px-3 py-2 max-w-full lg:max-w-[85%]'>
                        <div className='relative'>
                            <img className='w-[38px] h-[38px] border-2 border-white rounded-full max-w-[38px] p-[3px]' src="http://localhost:3001/images/demo.jpg" alt="" />
                            <div className='w-[10px] h-[10px] bg-green-500 rounded-full absolute right-0 bottom-0'></div>
                        </div>
                        <div className='flex justify-center items-start flex-col w-full bg-blue-500 shadow-lg shadow-blue-500/50 text-white py-2 px-3 rounded-lg'>
                            <span className='text-sm'>{m.message}</span>
                            <div className='flex items-center gap-1 mt-1'>
                                <span className='text-xs text-blue-100 opacity-75'>
                                    {new Date(m.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                )
            } else {
                return (
                    <div key={i} ref={scrollRef} className='w-full flex justify-end items-center mb-3'>
                    <div className='flex justify-start items-start gap-2 md:px-3 py-2 max-w-full lg:max-w-[85%]'>

                        <div className='flex justify-center items-start flex-col w-full bg-red-500 shadow-lg shadow-red-500/50 text-white py-2 px-3 rounded-lg'>
                            <span className='text-sm'>{m.message}</span>
                            <div className='flex items-center justify-end gap-1 mt-1'>
                                <span className='text-xs text-red-100 opacity-75'>
                                    {new Date(m.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </span>
                                <BsCheck2All className='text-green-300 text-sm' />
                            </div>
                        </div>
                        <div className='relative'>
                            <img className='w-[38px] h-[38px] border-2 border-white rounded-full max-w-[38px] p-[3px]' src="http://localhost:3001/images/admin.jpg" alt="" />
                            <div className='w-[10px] h-[10px] bg-green-500 rounded-full absolute right-0 bottom-0'></div>
                        </div>

                    </div>
                </div>
                )
            }
        }) : <div className='w-full h-full flex justify-center items-center text-white gap-2 flex-col'>
            <FaUser className='text-4xl text-gray-400' />
            <span className='text-lg'>Select Customer</span>
            <span className='text-sm text-gray-400'>Choose a customer to start chatting</span>
        </div>
    }

    {/* 🔤 Typing Indicator */}
    {isTyping && (
        <div className='w-full flex justify-start items-center mb-3'>
            <div className='flex justify-start items-start gap-2 md:px-3 py-2'>
                <div className='relative'>
                    <img className='w-[38px] h-[38px] border-2 border-white rounded-full max-w-[38px] p-[3px]' src="http://localhost:3001/images/demo.jpg" alt="" />
                    <div className='w-[10px] h-[10px] bg-green-500 rounded-full absolute right-0 bottom-0'></div>
                </div>
                <div className='bg-gray-600 text-white py-2 px-3 rounded-lg'>
                    <div className='flex items-center gap-1'>
                        <div className='flex gap-1'>
                            <div className='w-2 h-2 bg-gray-300 rounded-full animate-bounce'></div>
                            <div className='w-2 h-2 bg-gray-300 rounded-full animate-bounce' style={{animationDelay: '0.1s'}}></div>
                            <div className='w-2 h-2 bg-gray-300 rounded-full animate-bounce' style={{animationDelay: '0.2s'}}></div>
                        </div>
                        <span className='text-xs ml-2'>typing...</span>
                    </div>
                </div>
            </div>
        </div>
    )}

 


             

            </div> 
        </div>

        {/* 🚀 Enhanced Message Input Form */}
        <form onSubmit={send} className='flex gap-3 items-end'>
            <div className='flex-1 relative'>
                <input
                    value={text}
                    onChange={(e) => handleTyping(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className='w-full flex justify-between px-4 py-3 border border-slate-700 items-center focus:border-blue-500 rounded-lg outline-none bg-transparent text-[#d0d2d6] placeholder-gray-400'
                    type="text"
                    placeholder='Type your message...'
                    disabled={!customerId}
                />
                {text && (
                    <div className='absolute right-3 top-1/2 transform -translate-y-1/2'>
                        <BsEmojiSmile className='text-gray-400 cursor-pointer hover:text-yellow-400 transition-colors' />
                    </div>
                )}
            </div>
            <button
                type="submit"
                disabled={!text.trim() || !customerId}
                className='shadow-lg bg-[#06b6d4] hover:shadow-cyan-500/50 disabled:bg-gray-600 disabled:cursor-not-allowed text-semibold min-w-[75px] h-[45px] rounded-lg text-white flex justify-center items-center gap-2 transition-all duration-200 hover:bg-cyan-600'
            >
                <IoMdSend className='text-lg' />
                <span className='hidden sm:inline'>Send</span>
            </button>
        </form>




    </div>  

        </div> 

        </div>
        
    </div>
    );
};

export default SellerToCustomer;