import { useCallback, useEffect, useState } from 'react';
import { requestWithTokenAsync } from '../axios';

const useProfileComplete = (user_id, token) => {
	const [completedProfile, setCompletedProfile] = useState({
		hasProfile: true,
		hasProperty: true,
		data: ''
	});

	const fetchProfileInfo = useCallback(async () => {
		const res = await requestWithTokenAsync(
			'get',
			`/accounts/${user_id}/`,
			token
		);
		if(res?.data){
			setCompletedProfile({
				hasProfile: Boolean(res.data?.first_name && res.data?.last_name && res.data?.mobile),
				hasProperty: Boolean(res.data.properties && (res.data.properties.length > 0)),
				data: res.data
			});
		}
	},[]);

	useEffect(()=>{
		fetchProfileInfo();
	},[]);

	return { ...completedProfile };
};
  
export default useProfileComplete;