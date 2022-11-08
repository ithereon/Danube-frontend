import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/dist/client/router';

// layout for page
import Admin from '../../../layouts/Admin';

// components
import { WithTransition } from '../../../components/wrappers/withTransition';
import { SubHeader } from '../../../components/subHeader';
import { requestWithTokenAsync } from '../../../lib/axios';
import { BorderButton } from '../../../components/UI/borderButton';
import StyledModal from '../../../components/UI/styledModal';
import DetailsCard from '../../../components/Cards/detailsCard';

const PropertyDetails = (props) => {
	const router = useRouter();
	const {id} = router.query;
	const [deleting, setDeleting] = useState(false);
	const [data,setData] = useState();
	const [open,setOpen] = useState({state: false, id: id});

	useEffect(() => {
		if(!id){
			router.push(`/${props.role}/property/manage`);
		}else{
			const fetchData = async () => {
				const res = await requestWithTokenAsync(
					'get',
					`/properties/${id}/`,
					props.token
				);
				if(res?.data){
					const property = res.data;
					const modifiedData = {
						id: property.id,
						created_on: property.created_at,
						title: property.address_1,
						fields: {
							address_1: property.address_1,
							address_2: property.address_2,
							town: property.town,
							city: property.city,
							county: property.county,
							postcode: property.postcode,
						}
					};
					Object.keys(modifiedData).forEach(key => {
						if (modifiedData[key] === null || modifiedData[key] === '') {
							delete modifiedData[key];
						}else if(typeof modifiedData[key] === 'object'){
							Object.keys(modifiedData[key]).forEach(k => {
								if (modifiedData[key][k] === null || modifiedData[key][k] === '') {
									delete modifiedData[key][k];
								}
							});

						}
					});
					setData(modifiedData);
				}
			};
			fetchData();
		}
	}, []);

	const deleteHandler = async () => {
		setDeleting(true);
		const res = await requestWithTokenAsync(
			'delete',
			`/properties/${open.id}/`,
			props.token
		);
		if(res?.data === ''){
			handleToggle();
			router.push(`/${props.role}/property/manage`);
		}
		setDeleting(false);
	};

	const handleToggle = () => {
		setOpen(prev=>({...prev, state: !prev.state}));
	};

	return (
		<div className='container mx-auto pb-8 mb-6 flex flex-wrap items-stretch'>
			<WithTransition>
				<StyledModal
					open={open.state}
					onClose={handleToggle}
					aria-labelledby="modal-modal-title"
					aria-describedby="modal-modal-description"
				>
					<p className='text-neutral-700'>
						{`Are you sure you want to delete property with ID of ${open.id}?`}
					</p>
					<div className='flex items-center justify-between flex-wrap pt-8'>
						<BorderButton
							clicked={handleToggle}
							colorStyles='text-neutral-500 border-neutral-500 hover:bg-neutral-500 active:bg-neutral-600 focus:shadow-neutral-600'
						>
							Cancel
						</BorderButton>
						<BorderButton
							withLoader={deleting}
							clicked={deleteHandler}
							colorStyles='text-red-500 border-red-500 hover:bg-red-500 active:bg-red-600 focus:shadow-red-600'
						>
							Delete
						</BorderButton>
					</div>
				</StyledModal>
				<SubHeader>
					Property
				</SubHeader>
				{data && (
					<DetailsCard
						title={data.title}
						id={data.id}
						date={data.created_on}
						data={data.fields}
						editLink={`/${props.role}/property/edit?id=${id}`}
						onDelete={()=>setOpen({state: true, id: id})}
					/>
				)}
			</WithTransition>
		</div>
	);
};
export default PropertyDetails;

PropertyDetails.auth = true;
PropertyDetails.layout = Admin;