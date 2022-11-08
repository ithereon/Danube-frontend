import React, {useState, useEffect, useCallback, useRef} from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import InputEmoji from 'react-input-emoji';

import { requestWithTokenAsync } from '../../lib/axios';
import { decryptId, normalDate } from '../../lib/utils';
import {perPageLimit} from '../../lib/constants';
import { useRouter } from 'next/router';
import Search from '../UI/search';
import useBrowser from '../../lib/hooks/useBrowser';
import Loading from '../UI/loading';

const Room = ({userData, token, onToggle, onUpdate, showList, roomData}) => {
	const {isFirefox} = useBrowser();
	const router = useRouter();
	const {room} = router.query;
	const scrollRef = useRef(null);
	const [page, setPage] = useState(1);
	const [messages, setMessages] = useState();
	const [text, setText] = useState('');
	const [timeStampID, setTimeStampID] = useState();
	const [showContent, setShowContent] = useState();
	const [isMoreToLoad, setIsMoreToLoad] = useState();

	if(!roomData){
		router.push('?');
		return (
			<div className={`${showContent ? 'flex' : 'hidden'} flex-col bg-white w-full overflow-hidden h-[40rem] lg:flex`}>
				<Loading />
			</div>
		);
	}

	const getSocketUrl = useCallback(() => {
		const id = decryptId(room);
		return new Promise((resolve) => {
			resolve(`wss://danube-backend.herokuapp.com/ws/chat/${id}/`);
		});
	}, [room]);
    
	const { readyState, sendJsonMessage, getWebSocket } = useWebSocket(getSocketUrl, {
		onMessage: (e) => {
			const data = JSON.parse(e.data);
			if(data){
				const id = decryptId(room);
				getRoom(Number(id), page);
				onUpdate && onUpdate();
			}
		},
		share: false
	});

	const connectionStatus = {
		[ReadyState.CONNECTING]: 'Connecting...',
		[ReadyState.OPEN]: 'Open',
		[ReadyState.CLOSING]: 'Closing...',
		[ReadyState.CLOSED]: 'Closed',
		[ReadyState.UNINSTANTIATED]: 'Uninstantiated',
	}[readyState];
    

	const getRoom = useCallback( async (roomID, page) => {
		const res = await requestWithTokenAsync(
			'get',
			`/chats/${roomID}/messages/?limit=${perPageLimit*page}&offset=0/`,
			token
		);
		if(res?.data?.results){
			const data = res.data.results;
			data.sort(function(a,b){
				return new Date(b.timestamp) - new Date(a.timestamp);
			});
			// data.reverse();
			setMessages(data);
			setIsMoreToLoad(res.data.count > (page * perPageLimit));
		}
	},[]);

	const searchMessages = useCallback( async (roomID, page, key) => {
		const res = await requestWithTokenAsync(
			'get',
			`/chats/${roomID}/messages/?search=${key ? key : ''}&limit=${perPageLimit*page}&offset=0/`,
			token
		);
		if(res?.data?.results){
			const data = res.data.results;
			data.sort(function(a,b){
				return new Date(b.timestamp) - new Date(a.timestamp);
			});
			// data.reverse();
			setMessages(data);
			setIsMoreToLoad(res.data.count > (page * perPageLimit));
		}
	},[]);

	useEffect(() => {
		const id = decryptId(room);
		getRoom(id, page);
	}, [page,room]);

	useEffect(()=>{
		setShowContent(!showList);
	},[showList]);

	const submitHandler = useCallback(async(e, isEnter, text) => {
		!isEnter && e.preventDefault();
		const content = isEnter ? e : text;
		if(content){
			const id = decryptId(room);
			sendJsonMessage({
				user_id: userData.id,
				chat_id: Number(id),
				message: content,
				command: 'new_message'
			});
			setText('');
		}
	},[]);

	const scrollDown = useCallback(async()=>{
		scrollRef.current.scrollIntoView({behavior: 'smooth'});
	},[]);

	return (
		<div key={getWebSocket()?.url} className={`${showContent ? 'flex' : 'hidden'} flex-col bg-white w-full overflow-hidden h-[40rem] lg:flex`}>
			<div className="relative flex items-center justify-between p-3 border-b bg-slate-50 h-[4.5rem]">
				<div className='flex items-center'>
					<button 
						onClick={onToggle} 
						className={`${showContent ? 'block' : 'hidden'} px-4 h-full flex items-center lg:hidden`}
					>
						<i className='fas fa-arrow-left text-slate-700 text-xl' />
					</button>
					<div className='relative flex flex-col justify-start items-center max-w-[4rem]'>
						<span className={'w-10 h-10 relative text-base text-neutral-700 bg-slate-300 inline-flex items-center justify-center rounded-full'}>
							{roomData.online && (
								<div className='border p-[2px] box-content border-green-500 border-double w-full h-full absolute -top-[3px] -left-[3px] rounded-full' />
							)}
							<i className="fa-solid fa-user"></i>
						</span>
					</div>
					<h2 className="block ml-2 font-bold text-gray-600">
						{roomData.participant.username}
					</h2>
				</div>
				<div>
					<Search 
						onSearch={async (key)=>searchMessages(decryptId(room), 1, key)} 
						placeholder="search messages"
					/>
				</div>
			</div>
			<ul className={`${isFirefox ? 'flex-col -scale-y-100' : 'flex-col-reverse'} relative w-full h-full overflow-y-auto flex flex-1 pt-6 px-4 md:px-6`}>
				
				{(messages && messages.length > 0) && messages.map((item,index)=>(
					<li 
						className={`${isFirefox && '-scale-y-100'} ${item?.author?.username === userData.username ? 'items-end' : 'items-start'} relative flex flex-col mb-4`}
						key={item.id}
					>
						<div 
							className={`${item?.author?.username === userData.username ? 'bg-slate-100 text-slate-600' : 'bg-blue-500 text-white'} relative max-w-xl px-4 py-2 rounded shadow`}
							tabIndex={0}
							onClick={()=>{
								setTimeStampID(prev=>{
									if(prev === item.id){
										return '';
									}
									return item.id;
								});
							}}
							ref={index === 0 ? scrollRef : null}
						>
							<span className="block">
								{item.content}
							</span>
						</div>
						<div className={`${timeStampID === item.id ? 'h-4 mt-2' : 'h-0'} overflow-hidden text-xs text-slate-500 transition-all ease-in-out duration-100`}>
							{normalDate(item.timestamp)}
						</div>
					</li>
				))}
				<div className={`${isFirefox && '-scale-y-100'} text-center flex flex-col mb-2`}>
					<div className='text-xs text-slate-400 relative mb-4'>
						<p className='inline-block bg-white z-20 relative p-2'>
							{connectionStatus}
						</p>
						<hr className='left-0 right-0 bottom-1/2 top-1/2 absolute border-b border-slate-200 z-0' />
					</div>
					{isMoreToLoad && (					
						<button 
							onClick={()=>setPage(prev=>prev+1)}
							className='indigo-link text-sm'
						>
						load more
						</button>
					)}
					<button 
						onClick={scrollDown}
						className='text-slate-500 font-medium text-sm mt-2'
					>
						scroll down <i className='fas fa-chevron-down' />
					</button>
				</div>
			</ul>

			<form 
				className="w-full p-3 border-t bg-gradient-to-b from-emerald-200 to-cyan-200"
				noValidate
				onSubmit={e=>submitHandler(e,false,text)}
			>
				<div 
					className='w-full h-full flex items-center justify-between bg-white shadow rounded-lg'
					tabIndex={0}
				>
					<InputEmoji
						value={text}
						onChange={setText}
						cleanOnEnter
						onEnter={(e)=>submitHandler(e,true)}
						placeholder="Type a message"
						borderRadius={0}
						borderColor={'transparent'}
						height={20}
					/>
					<button type="submit" className='h-full block pr-4 pl-2 flex-1'>
						<span className='sr-only'>send</span>
						<i className="fa-solid fa-paper-plane text-slate-500 text-xl" />
					</button>
				</div>
			</form>
		</div>
	);
};

export default Room;
