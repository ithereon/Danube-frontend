const handleContactFormSubmit = (name, email, message, token) => {
	const data = {
		name,
		email,
		message,
		token
	};
	console.log(data.name);
};

export default handleContactFormSubmit;