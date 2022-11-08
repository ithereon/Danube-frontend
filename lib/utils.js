
import AES from 'crypto-js/aes';
import { enc } from 'crypto-js';

export const validateEmail = (val) => {
	// eslint-disable-next-line no-useless-escape
	const regex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
	return regex.test(val) === true;
};


export const normalDate = (date) => {
	const jsDate = new Date(date);
	return jsDate.toDateString();
};

export const timeAgo = time => {
	switch (typeof time) {
	case 'number':
		break;
	case 'string':
		time = +new Date(time);
		break;
	case 'object':
		if (time.constructor === Date) {
			time = time.getTime();
		}
		break;
	default:
		time = +new Date();
	}
	const time_formats = [
		[60, 'seconds', 1], // 60
		[120, '1 minute ago', '1 minute from now'], // 60*2
		[3600, 'minutes', 60], // 60*60, 60
		[7200, '1 hour ago', '1 hour from now'], // 60*60*2
		[86400, 'hours', 3600], // 60*60*24, 60*60
		[172800, 'Yesterday', 'Tomorrow'], // 60*60*24*2
		[604800, 'days', 86400], // 60*60*24*7, 60*60*24
		[1209600, 'Last week', 'Next week'], // 60*60*24*7*4*2
		[2419200, 'weeks', 604800], // 60*60*24*7*4, 60*60*24*7
		[4838400, 'Last month', 'Next month'], // 60*60*24*7*4*2
		[29030400, 'months', 2419200], // 60*60*24*7*4*12, 60*60*24*7*4
		[58060800, 'Last year', 'Next year'], // 60*60*24*7*4*12*2
		[2903040000, 'years', 29030400], // 60*60*24*7*4*12*100, 60*60*24*7*4*12
		[5806080000, 'Last century', 'Next century'], // 60*60*24*7*4*12*100*2
		[58060800000, 'centuries', 2903040000], // 60*60*24*7*4*12*100*20, 60*60*24*7*4*12*100
	];
	let seconds = (+new Date() - time) / 1000,
		token = 'ago',
		list_choice = 1;

	if (seconds <= 60) {
		return 'Just now';
	}

	if (seconds < 0) {
		seconds = Math.abs(seconds);
		token = 'from now';
		list_choice = 2;
	}
	let i = 0,
		format;
	format = time_formats[i++];
	while (format) {
		if (seconds < format[0]) {
			if (typeof format[2] === 'string') {
				return format[list_choice];
			} else {
				return Math.floor(seconds / format[2]) + ' ' + format[1] + ' ' + token;
			}
		}
		format = time_formats[i++];
	}

	return time;
};

export const encryptId = (str) => {
	// eslint-disable-next-line no-undef
	const ciphertext = AES.encrypt(str+'', process.env.SECRET_PHRASE);
	return encodeURIComponent(ciphertext.toString());
};
export const decryptId = (str) => {
	const decodedStr = decodeURIComponent(str+'');
	// eslint-disable-next-line no-undef
	const decrypted = AES.decrypt(decodedStr, process.env.SECRET_PHRASE);
	return decrypted?.toString(enc.Utf8);
};

export const sidebarMenu = (userType) => {
	const role = userType.toLowerCase();
	if(role === 'business'){
		return ([
			{
				title: 'dashboard',
				icon: 'fa-chart-line',
				link: `/${role}`
			},{
				title: 'contact details',
				icon: 'fa-edit',
				link: `/${role}/settings`,
			},{
				title: 'business',
				icon: 'fa-home',
				link: `/${role}/property/manage`

			},{
				title: 'marketplace',
				icon: 'fa-shop',
				link: `/${role}/marketplace`
			},{
				title: 'received RFQs',
				icon: 'fa-inbox',
				link: `/${role}/RFQ/manage`
			},{
				title: 'Expressed Interests',
				icon: 'fa-paper-plane',
				link: `/${role}/EOI/manage`
			},{
				title: 'Quotes',
				icon: 'fa-solid fa-tags',
				link: `/${role}/quote/manage`
			},{
				title: 'Contracts',
				icon: 'fa-file-contract',
				link: `/${role}/contract/manage`
			},{
				title: 'Invoices',
				icon: 'fa-file-invoice-dollar',
				link: `/${role}/invoice/manage`
			}
		]);
	}else if(role === 'customer'){
		return ([
			{
				title: 'dashboard',
				icon: 'fa-chart-line',
				link: `/${role}`
			},{
				title: 'contact details',
				icon: 'fa-edit',
				link: `/${role}/settings`
			},{
				title: 'property',
				icon: 'fa-home',
				link: `/${role}/property/manage`
			},{
				title: 'RFQs',
				icon: 'fa-briefcase',
				link: `/${role}/RFQ/manage`,
			},{
				title: 'RFQ Interests',
				icon: 'fa-inbox',
				link: `/${role}/EOI/manage`
			},{
				title: 'Quotes',
				icon: 'fa-solid fa-tags',
				link: `/${role}/quote/manage`
			},{
				title: 'Contracts',
				icon: 'fa-file-contract',
				link: `/${role}/contract/manage`
			},{
				title: 'Invoices',
				icon: 'fa-file-invoice-dollar',
				link: `/${role}/invoice/manage`
			},{
				title: 'traders',
				icon: 'fa-list',
				link: `/${role}/traders/manage`
			},
		]);
	}

	return ([
		{
			title: 'dashboard',
			icon: 'fa-chart-line',
			link: `/${role}`
		},{
			title: 'contact details',
			icon: 'fa-edit',
			link: `/${role}/settings`
		}
	]);
};


export const footerLinks = [
	{title: 'T&C', url: '/terms-conditions'},
	{title: 'Privacy policy', url: '/privacy-policy'},
	{title: 'Cookies', url: '/cookies'},
	{title: 'FAQ', url: '/faq'},
	{title: 'Testimonials', url: '/testimonials'},
];
