import React, {useState} from 'react';
import { postDataAsync } from '../../lib/axios';

const handleContactFormSubmit = async (firstName, lastName, email, message, token) => {
	const data = {
		firstName,
		lastName,
		email,
		message,
		token
	};
	console.log(data);
	
	const res = await postDataAsync('/contact_msg', {
		name: data.firstName + data.lastName,
		email: data.email,
		message: data.message,
		token: data.token
	});

	if(res?.data?.status === 'OK') {
		return true
	}else {
		return false
	}
};

export default handleContactFormSubmit;