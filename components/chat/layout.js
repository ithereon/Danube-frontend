import React, {useState, useEffect, useCallback} from 'react';
import { requestWithTokenAsync } from '../../lib/axios';
import { useRouter } from 'next/router';
import { decryptId, encryptId, timeAgo } from '../../lib/utils';
import { perPageLimit } from '../../lib/constants';

import { SubHeader } from '../../components/subHeader';
import Search from '../UI/search';
import Room from './room';
import WelcomeChat from './welcome';

const ChatLayout = ({token, userData}) => {
	const router = useRouter();
	const {room} = router.query;
	const [chats, setChats] = useState();
	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState();
	const [type, setType] = useState();
	const [showList, setShowList] = useState(false);
	const [roomData, setRoomData] = useState();

	const getListOfChats = useCallback( async(page, searchKey) => {
		const res = await requestWithTokenAsync(
			'get',
			`/chats/?search=${searchKey ? searchKey : ''}&limit=${page*perPageLimit}&offset=0/`,
			token
		);
		if(res?.data?.results){
			setChats(res.data.results);
			setHasMore(res.data.chat_list_total_count > page*perPageLimit);
		}
	},[]);

	useEffect(() => {
		getListOfChats(page);
	}, [page]);


	useEffect(()=>{
		if(!room){
			setType('welcome');
			setShowList(true);
		}else{
			setType('room');
		}
	},[room]);


	const renderContent = useCallback((showList, room) => {
		if(type === 'room'){
			const id = encryptId(room);
			return (
				<Room
					userData={userData}
					roomData={roomData}
					token={token}
					onToggle={()=>{
						setShowList(prev=>!prev);
					}}
					showList={showList}
					key={id}
				/>
			);
		}
		return <WelcomeChat />;
	},[type, roomData]);

	return (
		<div className='md:container mx-auto  flex flex-wrap items-stretch relative'>
			<SubHeader >
				Chat
			</SubHeader>
			<div  className="container mx-auto px-4 m-[-17px]">
				<div className="min-w-full flex flex-col border rounded  lg:grid lg:grid-cols-3">
					<div  className={`${showList ? 'block' : 'hidden'} h-full border-r border-slate-200  bg-white lg:block lg:col-span-1`}>
						<div className="px-4 py-3 h-[4.5rem] flex items-center">
							<Search onSearch={(key)=>{getListOfChats(page, key);}} />
						</div>

						<ul
							className="overflow-auto h-full"
							id="tabs-tab"
							role="tablist"
						>
							<h2 className="my-2 px-4 text-lg text-gray-600">Chats</h2>
							{chats?.length === 0 && (
								<p className='px-4 text-slate-400 text-sm'>
                                    No chats found
								</p>
							)}
							{chats?.length > 0 && (
								chats.map(item=>(
									<li
										className="nav-item"
										key={item.id}
									>
										<button
											className={`${Number(decryptId(room)) === item.id ? 'bg-gradient-to-b from-emerald-200 to-cyan-200 hover:bg-gradient-to-b' : 'bg-white hover:bg-slate-100'} text-slate-600 flex items-center w-full px-3 py-2 text-sm transition duration-150 ease-in-out border-b border-slate-200 cursor-pointer focus:outline-none`}
											onClick={async ()=>{
												const id = encryptId(''+item.id);
												router.push(`?room=${id}`);
												setShowList(prev=>!prev);
												setRoomData(item);
												if(item.is_new_message){
													setChats(prev=>{
														const updatedChats = prev;
														updatedChats.find(e=>e.id === item.id).is_new_message = false;
														return updatedChats;
													});
												}
											}}
										>
											<div className='relative flex flex-col justify-start items-center max-w-[4rem]'>
												{/* image outline */}
												<span className={`${item.online && 'outline-1 outline-green-500 outline-offset-2 outline-double'} w-10 h-10 text-base text-neutral-700 bg-slate-200 inline-flex items-center justify-center rounded-full`}>
													<i className="fa-solid fa-user" />
												</span>
												{/* online dot */}
												{/* <span className="absolute w-2 h-2 bg-green-500 rounded-full right-0 top-1" /> */}
											</div>
											<div className="w-full">
												<div className="flex justify-between">
													<span className="block ml-2 font-semibold capitalize">
														{item.participant.username}
													</span>
													<span className="block ml-2 text-sm">
														{timeAgo(item.last_message.timestamp)}
													</span>
												</div>
												<div className="flex justify-between items-center mt-1">
													{item.last_message && (
														<span className="block ml-2 text-sm text-left">
															{item.last_message.content}
															{item.is_new_message && (
																<span className='inline-flex justify-center items-center w-2 h-2 rounded-full bg-rose-400 shadow-lg ml-1 align-middle text-[0.6rem] text-white font-normal' />
															)}
														</span>
													)}
												</div>
											</div>
										</button>
									</li>
								))
							)}
							{hasMore && (
								<div className='w-full text-center my-2'>
									<button onClick={()=>setPage(prev=>prev+1)} className='indigo-link text-sm'>
										load more
									</button>
								</div>
							)}
						</ul>
					</div>
					<div  className="h-[31rem] flex flex-col flex-1 relative lg:col-span-2">
						{/* {children} */}
						{renderContent(showList,room)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default ChatLayout;
