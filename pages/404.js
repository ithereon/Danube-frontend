import React, { useEffect } from 'react';
import Router from 'next/router';

const Error404 = ({token, role}) => {
	useEffect(() => {
		if(token){
			Router.push(`/${role}`);
		}else{
			Router.push('/');
		}
	},[]);

	return <div />;
};

export default Error404;
