import Image from 'next/image';
import React from 'react';

const WelcomeChat = () => (
	<div  className="h-[31rem] w-full hidden bg-white lg:block">
		<div  className=" h-[31rem] relative w-full p-6 flex justify-center items-center flex-col overflow-y-auto">
			<Image
				src={'/img/comment.png'}
				alt="live chat"
				height={64}
				width={64}
			/>
			<h2 className='text-slate-700 font-medium text-lg mt-4'>
					Welcome!
			</h2>
			<p className='text-slate-600 text-base mt-2'>
				Select chat to start conversation
			</p>
		</div>
	</div>
);

export default WelcomeChat;
