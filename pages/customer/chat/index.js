import React from 'react';

import Admin from '../../../layouts/Admin';
import ChatLayout from '../../../components/chat/layout';

const Chat = ({token, role, userData}) => {
	return (
		<ChatLayout
			token={token}
			role={role}
			userData={userData}
		/>
	);
};

export default Chat;

Chat.auth = true;
Chat.layout = Admin;