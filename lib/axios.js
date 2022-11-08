import axios from 'axios';

// eslint-disable-next-line no-undef
axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

export const getDataAsync = async (url,params) => {
	try {
		const response = await axios.get(url,{...params});
		return {data: response.data};
	} catch (error) {
		return {data: error};
	}
};

export const postDataAsync = async (url, data, header) => {
	try {
		const response = await axios.post(url, { ...data }, header);
		return {data: response.data};
	} catch (error) {
		return {error: error};
	}
};

export const requestWithTokenAsync = async (method, url, token, data, header) => {
	try {
		const response = await axios({
			method: method ? method : 'get',
			url: url,
			data: data,
			headers: {
				...header,
				'Authorization': `Bearer ${token}`
			}
		});
		return {data: response.data};
	} catch (error) {
		return {error: error};
	}
};