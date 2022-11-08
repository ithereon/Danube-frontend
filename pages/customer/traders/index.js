import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/dist/client/router';

// layout for page
import Admin from '../../../layouts/Admin';
import { WithTransition } from '../../../components/wrappers/withTransition';

// components
import { SubHeader } from '../../../components/subHeader';
import { requestWithTokenAsync } from '../../../lib/axios';
import DetailsCard from '../../../components/Cards/detailsCard';

const TraderDetails = (props) => {
	const router = useRouter();
	const {id} = router.query;
	const [businessData,setBusinessData] = useState();

	useEffect(() => {
		if(!id){
			router.push(`/${props.role}/traders/manage`);
		}else{
			const fetchData = async () => {
				const res = await requestWithTokenAsync(
					'get',
					`/business_details/${id}/`,
					props.token
				);
				if(res?.data){
					const business = res.data;
					const modifiedBusinessData = {
						title: business.business_name,
						id: business.id,
						created_on: business.created_at,
						description: business.description,
						fields: {
							company_house_number: business.company_number,
							main_trade: business.main_trade,
							vat: business.vat,
							website: business.website,
							address_details: {
								// address_1: business.address_1,
								// address_2: business.address_2,
								town: business.town,
								city: business.city,
								county: business.county,
								postcode: business.postcode,
							}
						}
					};
					Object.keys(modifiedBusinessData).forEach(key => {
						if (modifiedBusinessData[key] === null || modifiedBusinessData[key] === '') {
							delete modifiedBusinessData[key];
						}else if(typeof modifiedBusinessData[key] === 'object'){
							Object.keys(modifiedBusinessData[key]).forEach(k => {
								if (modifiedBusinessData[key][k] === null || modifiedBusinessData[key][k] === '') {
									delete modifiedBusinessData[key][k];
								}else if(typeof modifiedBusinessData[key][k] === 'object'){
									Object.keys(modifiedBusinessData[key][k]).forEach(j => {
										if (modifiedBusinessData[key][k][j] === null || modifiedBusinessData[key][k][j] === '') {
											delete modifiedBusinessData[key][k][j];
										}
									});
								}
							});
						}
					});
					setBusinessData(modifiedBusinessData);
				}
			};
			fetchData();
		}
	}, []);

	return (
		<div className='container mx-auto pb-8 mb-6 flex flex-wrap items-stretch'>
			<WithTransition>
				<SubHeader>
                    Trader
				</SubHeader>
				{businessData && (
					<DetailsCard
						title={businessData.title}
						id={businessData.id}
						date={businessData.created_on}
						description={businessData.description}
						website={businessData.website}
						data={businessData.fields}
					/>
				)}
			</WithTransition>
		</div>
	);
};
export default TraderDetails;

TraderDetails.auth = true;
TraderDetails.layout = Admin;