import React, { useEffect, useRef, useState } from 'react';
import { AiOutlineMessage, AiOutlinePlus } from 'react-icons/ai'
import { GrEmoji } from 'react-icons/gr'
import { IoSend } from 'react-icons/io5'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom'
import { add_friend, messageClear, send_message,updateMessage, get_available_sellers } from '../../store/reducers/chatReducer';
import toast from 'react-hot-toast';
import io from 'socket.io-client'
import {FaList} from 'react-icons/fa'

// 🚀 Enhanced Socket Connection for Customer Chat
const socket = io('http://localhost:5001', {
    autoConnect: true,
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5,
    timeout: 20000,
    transports: ['websocket', 'polling']
});

// 🔧 Socket Connection Logging
socket.on('connect', () => {
    console.log('✅ Customer Chat Socket Connected:', socket.id);
});

socket.on('disconnect', (reason) => {
    console.log('❌ Customer Chat Socket Disconnected:', reason);
});

socket.on('connect_error', (error) => {
    console.error('🔥 Customer Chat Socket Connection Error:', error);
});

const Chat = () => {

    const scrollRef = useRef()

    const dispatch = useDispatch()
    const {sellerId} = useParams()
    const {userInfo } = useSelector(state => state.auth)
    const {fb_messages,currentFd,my_friends,successMessage,available_sellers } = useSelector(state => state.chat)
    const [text,setText] = useState('')
    const [receverMessage,setReceverMessage] = useState('')
    const [activeSeller,setActiveSeller] = useState([])
    const [show, setShow] = useState(false)
    const [isTyping, setIsTyping] = useState(false)
    
    useEffect(() => {
        if (userInfo?.id) {
            socket.emit('add_user', userInfo.id, userInfo);
            console.log('🔗 Customer connected to socket:', userInfo.id);
        }
    }, [userInfo]);

    // 🚀 Get available sellers when component mounts
    useEffect(() => {
        if (userInfo?.id) {
            console.log('📋 Getting available sellers...');
            dispatch(get_available_sellers());
        }
    }, [userInfo, dispatch]);

    // 🚀 Auto-connect to seller when available
    useEffect(() => {
        if (userInfo?.id && available_sellers.length > 0 && !sellerId) {
            // If no specific seller is selected, connect to the first available seller
            const firstSeller = available_sellers[0];
            console.log('🔗 Auto-connecting to seller:', firstSeller);

            dispatch(add_friend({
                sellerId: firstSeller._id,
                userId: userInfo.id
            }));
        } else if (sellerId && userInfo?.id) {
            // Connect to specific seller from URL
            dispatch(add_friend({
                sellerId: sellerId,
                userId: userInfo.id
            }));
        }
    }, [sellerId, userInfo, available_sellers, dispatch]);

    // 🚀 Enhanced Send Message Function
    const send = (e) => {
        if (e) e.preventDefault();
        if (text.trim()) {
            const messageData = {
                userId: userInfo.id,
                text: text.trim(),
                sellerId,
                name: userInfo.name,
                timestamp: new Date().toISOString()
            };

            console.log('📤 Customer sending message:', messageData);
            dispatch(send_message(messageData));
            setText('');

            // Stop typing indicator
            socket.emit('typing', {
                senderId: userInfo.id,
                receiverId: sellerId,
                typing: false
            });
        }
    };

    // 🎯 Handle Enter Key Press
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            send();
        }
    };

    // 🔤 Handle Typing Indicator
    const handleTyping = (value) => {
        setText(value);

        if (value.trim() && sellerId) {
            socket.emit('typing', {
                senderId: userInfo.id,
                receiverId: sellerId,
                typing: true
            });
        } else {
            socket.emit('typing', {
                senderId: userInfo.id,
                receiverId: sellerId,
                typing: false
            });
        }
    };

    useEffect(() => {
        socket.on('seller_message', msg => {
            console.log('📨 Received seller message:', msg);
            setReceverMessage(msg);
        });

        socket.on('activeSeller', (sellers) => {
            setActiveSeller(sellers);
        });

        socket.on('typing', (data) => {
            if (data.senderId === sellerId) {
                setIsTyping(true);
                setTimeout(() => setIsTyping(false), 3000);
            }
        });

        return () => {
            socket.off('seller_message');
            socket.off('activeSeller');
            socket.off('typing');
        };
    }, [sellerId]);

    useEffect(() => {
        if (successMessage) {
            socket.emit('send_customer_message',fb_messages[fb_messages.length - 1])
            dispatch(messageClear())
        }
    },[successMessage])

    useEffect(() => {
        if (receverMessage) {
            if (sellerId === receverMessage.senderId && userInfo.id === receverMessage.receverId) {
                dispatch(updateMessage(receverMessage))
            } else {
                toast.success(receverMessage.senderName + " " + "Send A message")
                dispatch(messageClear())
            }
        }

    },[receverMessage])
    
    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth'})
    },[fb_messages])

    return (
        <div className='bg-white p-3 rounded-md'>
    <div className='w-full flex'>
        
        <div className={`w-[230px] md-lg:absolute bg-white md-lg:h-full -left-[350px] ${show ? '-left-0' : '-left-[350px]'}`}>
            <div className='flex justify-center gap-3 items-center text-slate-600 text-xl h-[50px]'>
                <span><AiOutlineMessage /></span>
                <span>Message</span>
            </div>
            <div className='w-full flex flex-col text-slate-600 py-4 h-[400px] pr-3'>
               {
                my_friends.map((f,i) => <Link to={`/dashboard/chat/${f.fdId}`} key={i}  className={`flex gap-2 justify-start items-center pl-2 py-[5px]`} >
                <div className='w-[30px] h-[30px] rounded-full relative'>
                   
                   {
                    activeSeller.some(c => c.sellerId === f.fdId ) && <div className='w-[10px] h-[10px] rounded-full bg-green-500 absolute right-0 bottom-0'></div> 
                   } 
                    
                    <img src={f.image} alt="" />
                </div>
                <span>{f.name}</span>
            </Link> )
               }
                
            </div>
        </div>

        <div className='w-[calc(100%-230px)] md-lg:w-full'>
            {
                currentFd ? <div className='w-full h-full'>
                <div className='flex justify-between gap-3 items-center text-slate-600 text-xl h-[50px]'>
           
            <div className='flex gap-2'>
            <div className='w-[30px] h-[30px] rounded-full relative'>
            {
            activeSeller.some(c => c.sellerId === currentFd.fdId) && <div className='w-[10px] h-[10px] rounded-full bg-green-500 absolute right-0 bottom-0'></div>
            } 
              <img src={currentFd.image} />
                    </div>
                    <span>{currentFd.name}</span>
                
            </div> 

                <div onClick={()=> setShow(!show)} className='w-[35px] h-[35px] hidden md-lg:flex cursor-pointer rounded-sm justify-center items-center bg-sky-500 text-white'>
                    <FaList/>
                </div>      
               
                </div>
                <div className='h-[400px] w-full bg-slate-100 p-3 rounded-md'>
                    <div className='w-full h-full overflow-y-auto flex flex-col gap-3'>

        {
            fb_messages.map((m, i) => {
                if (currentFd?.fdId !== m.receverId) {
                    return(
                 <div ref={scrollRef} key={i} className='w-full flex gap-2 justify-start items-center text-[14px]'>
            <img className='w-[30px] h-[30px] ' src="http://localhost:3000/images/user.png" alt="" />
            <div className='p-2 bg-purple-500 text-white rounded-md'>
                <span>{m.message}</span>
            </div>
        </div>
              )     
                }else{ 
                  return (
                    <div ref={scrollRef} key={i} className='w-full flex gap-2 justify-end items-center text-[14px]'>
                    <img className='w-[30px] h-[30px] ' src="http://localhost:3000/images/user.png" alt="" />
                    <div className='p-2 bg-cyan-500 text-white rounded-md'>
                        <span>{m.message}</span>
                    </div>
                </div> 
                  ) 
                }
            })
        } 
                    </div>
                </div>
                <div className='flex p-2 justify-between items-center w-full'>
                    <div className='w-[40px] h-[40px] border p-2 justify-center items-center flex rounded-full'>
                        <label className='cursor-pointer' htmlFor=""><AiOutlinePlus /></label>
                        <input className='hidden' type="file" />
                    </div>
                    <div className='border h-[40px] p-0 ml-2 w-[calc(100%-90px)] rounded-full relative'>
                        <input
                            value={text}
                            onChange={(e) => handleTyping(e.target.value)}
                            onKeyPress={handleKeyPress}
                            type="text"
                            placeholder='Type your message...'
                            className='w-full rounded-full h-full outline-none p-3 focus:border-blue-500 transition-colors'
                            disabled={!sellerId}
                        />
                        <div className='text-2xl right-2 top-2 absolute cursor-pointer hover:text-yellow-500 transition-colors'>
                            <span><GrEmoji /></span>
                        </div>
                    </div>
                    <div className='w-[40px] p-2 justify-center items-center rounded-full'>
                        <div
                            onClick={send}
                            className={`text-2xl cursor-pointer transition-colors ${
                                text.trim() ? 'text-blue-500 hover:text-blue-600' : 'text-gray-400'
                            }`}
                        >
                            <IoSend />
                        </div>
                    </div>
                </div>
            </div> : <div onClick={() => setShow(true)} className='w-full h-[400px] flex justify-center items-center text-lg font-bold text-slate-600 flex-col gap-4'>
                {available_sellers.length > 0 ? (
                    <>
                        <div className='text-blue-500 text-4xl'>💬</div>
                        <span>Connecting to Support...</span>
                        <div className='text-sm text-gray-500'>
                            You'll be connected to: {available_sellers[0]?.shopInfo?.shopName || available_sellers[0]?.name}
                        </div>
                    </>
                ) : (
                    <>
                        <div className='text-gray-400 text-4xl'>🔍</div>
                        <span>Loading Support...</span>
                        <div className='text-sm text-gray-500'>Please wait while we connect you</div>
                    </>
                )}
            </div>
            }
            
        </div>
    </div>
</div>
    );
};

export default Chat;