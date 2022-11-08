import React from 'react';
import { normalDate } from '../../lib/utils';
import Loading from '../UI/loading';

const CardProfile = (props) => {
	const {user} = props;
	return (
		<div className="relative flex flex-col min-w-0 break-words bg-white w-full h-full shadow-xl rounded-lg">
			<div className="p-6">
				{!props.noImage && (
					<div className="flex flex-wrap justify-center mb-8">
						<div className="w-full px-4 flex justify-center">
							<span className="w-24 h-24 text-xl text-neutral-900 bg-slate-200 inline-flex items-center justify-center rounded-full">
								<i className="fa-solid fa-user"></i>
							</span>
						</div>
					</div>
				)}
				{!user && <Loading />}
				{user && (
					<div className={props.align ? props.align : 'text-center'}>
						<h2 className="text-lg font-semibold leading-normal text-slate-600 mb-4 capitalize">
							{props.customTitle ? (
								<>
									{props.customTitle}
									<hr className="mb-2 mt-1 border-b-2 border-emerald-300 w-10" />
								</>
							) : (
								<>
									{user.first_name && user.first_name+' '}
									{user.last_name && user.last_name}
								</>
							)}
						</h2>
						{props.customTitle && (
							<strong className='block mb-2 text-slate-500 font-semibold capitalize text-sm'>
								{user.first_name && user.first_name+' '}
								{user.last_name && user.last_name}
							</strong>
						)}
						<ul>
							{user.title && (
								<li className="mb-2 mt-4 text-slate-600 capitalize text-sm">
									<label htmlFor='titleField' className='font-semibold text-slate-500'>title: </label>
									<span id="titleField">{user.title}</span>
								</li>
							)}
							{user.mobile && (
								<li className="mb-2 text-slate-600 text-sm">
									<i className="fas fa-phone mr-2 text-lg text-slate-400"></i>
									{user.mobile}
								</li>
							)}
							<li className="mb-2 text-slate-600 text-sm">
								<i className="fas fa-envelope mr-2 text-lg text-slate-400"></i>
								{user.email}
							</li>

							{user.id && (
								<li className="mb-2 text-slate-600 capitalize text-sm">
									<label htmlFor='titleField' className='font-semibold text-slate-500'>user ID: </label>
									<span id="titleField">{user.id}</span>
								</li>
							)}
						</ul>
						{user.created_at && (
							<div className="mt-4 text-slate-700">
								<small className='text-xs'>
								Last updated on
									{' '}
									<span className='font-semibold text-slate-800'>
										{normalDate(user.created_at)}
									</span>
								</small>
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
};

export default CardProfile;
