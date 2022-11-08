export const perPageLimit = 12;

export const userTypeData = [
	{
		label: 'Business', 
		icon: <i className="fa-solid fa-briefcase"></i>
	},
	{
		label: 'Customer', 
		icon: <i className="fa-solid fa-user"></i>
	}
];

export const statusIconColors = {
	draft: 'text-blue-500',
	saved: 'text-yellow-600',
	open: 'text-green-500',
	private: 'text-indigo-600',
	contracted: 'text-amber-500',
	archived: 'text-slate-500',
	completed: 'text-emerald-600',
	new: 'text-green-700',
	declined: 'text-slate-300',
	rejected: 'text-slate-300',
	accepted: 'text-green-500',
	waiting: 'text-yellow-500',
	in_progress: 'text-green-500'
};

export const statusIcon = {
	draft: 'fa-file-circle-exclamation text-blue-500',
	saved: 'fa-solid fa-bookmark text-yellow-600',
	open: 'fa-solid fa-earth-europe text-green-500',
	private: 'fa-solid fa-key text-indigo-600',
	contracted: 'fa-solid fa-file text-amber-500',
	archived: 'fa-solid fa-box-archive text-slate-500',
	completed: 'fa-solid fa-circle-check text-emerald-600',
	done: 'fa-solid fa-circle-check text-emerald-600',
	new: 'fa-solid fa-file-circle-check text-green-700',
	declined: 'fa-solid fa-ban text-slate-300',
	rejected: 'fa-solid fa-ban text-slate-300',
	accepted: 'fa-solid fa-handshake-simple text-green-500',
	waiting: 'fa-solid fa-circle text-yellow-500',
	in_progress: 'fa-solid fa-circle text-green-500',
	pending: 'fa-solid fa-circle text-green-500',
	paid: 'fa-solid fa-circle-check text-emerald-600',
	active: 'fa-solid fa-circle text-green-500'
};

export const HeaderStatSpacing = [
	'lg:pr-2',
	'lg:pl-2 xl:pr-2',
	'lg:pr-2 xl:pl-2',
	'lg:pl-2'
];