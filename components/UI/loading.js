import React from 'react';

const Loading = ({styles}) => (
	<div className='flex justify-center items-center text-slate-700 text-xl p-5'>
		<i className={`fas fa-circle-notch fa-spin ${styles ? styles : ''}`} />
	</div>
);

export default Loading;