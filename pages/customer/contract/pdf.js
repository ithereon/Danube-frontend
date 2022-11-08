import React, {useEffect, useState, useCallback} from 'react';
import dynamic from 'next/dynamic';
import Loading from '../../../components/UI/loading';
import { requestWithTokenAsync } from '../../../lib/axios';
import { useRouter } from 'next/router';
const GeneratePDF = dynamic(()=>import('../../../lib/generateContract'),{ssr:true});

const ContractPDFPage = ({token, role}) => {
	const router = useRouter();
	const {id} = router.query;
	const [data, setData] = useState();

	const fetchContract = useCallback(async () => {
		const res = await requestWithTokenAsync(
			'get',
			`/contracts/${id}/`,
			token
		);
		if(res?.data?.id){
			setData(res.data);
		}else{
			router.push(`/${role}/contract/manage`);
		}
	},[]);

	useEffect(() => {
		if(!id){
			router.push(`/${role}/contract/manage`);
		}else{
			fetchContract();
		}
	}, []);


	if(!data || !data.id) return <Loading />;

	return (
		<>
			<GeneratePDF data={data} />
		</>
	);
};

export default ContractPDFPage;

ContractPDFPage.auth = true;