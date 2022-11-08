import React, {useEffect, useState, useCallback} from 'react';
import {useRouter} from 'next/dist/client/router';
import Link from 'next/link';
import { requestWithTokenAsync } from '../../../lib/axios';

// layout for page
import Admin from '../../../layouts/Admin';
import { WithTransition } from '../../../components/wrappers/withTransition';

// components
import { SubHeader } from '../../../components/subHeader';
import DetailsCard from '../../../components/Cards/detailsCard';
import ListItem from '../../../components/lists/listItem';
import StyledLabel from '../../../components/UI/styledLabel';
import { BorderButton } from '../../../components/UI/borderButton';
import Feedback from '../../../components/UI/feedback';
import PaymentFields from '../../../components/paymentFields';
import Image from 'next/image';

const ContractDetails = ({role, token, userData}) => {
	const router = useRouter();
	const {id} = router.query;
	const [selectedProperty, setSelectedProperty] = useState();
	const [selectedBusiness, setSelectedBusiness] = useState();
	const [contract, setContract] = useState();
	const [message, setMessage] = useState();

	const getData = useCallback(async () => {
		const res = await requestWithTokenAsync(
			'get',
			`/contracts/${id}/`,
			token
		);
		if(res?.data?.id){
			const propertyData = res.data.property_obj;
			const propert = {
				address_1: propertyData.address_1,
				address_2: propertyData.address_2,
				town: propertyData.town,
				city: propertyData.city,
				county: propertyData.county,
				postcode: propertyData.postcode,
				profile: {
					name: res.data.owner_name || userData.username || '',
					surname: '',
					title: ''
				}
			};
			Object.keys(propert).forEach(key => {
				if (propert[key] === null || propert[key] === '') {
					delete propert[key];
				}
			});
			setSelectedProperty(propert);

			const businessData = res.data.business;
			const business = {
				business_name: businessData.business_name,
				website: businessData.website.replace('https://',''),
				separator: true,
				vat: businessData.vat,
				address_1: businessData.address_1,
				address_2: businessData.address_2,
				town: businessData.town,
				city: businessData.city,
				county: businessData.county,
				postcode: businessData.postcode,
				profile: {
					name: res.data.business_name || '',
					surname: '',
					title: ''
				}
			};
			Object.keys(business).forEach(key => {
				if (business[key] === null || business[key] === '') {
					delete business[key];
				}
			});
			setSelectedBusiness(business);

			setContract({
				id: res.data.id,
				costs: {
					subtotal: res.data.total_cost,
					discount: res.data.discount,
					discount_amount: res.data.discount_amount,
					subtotal_after_discount: res.data.subtotal_after_discount,
					vat: res.data.vat,
					vat_amount: res.data.vat_amount,
					total_to_pay: res.data.total,
					first_payment_amount: res.data.first_payment_amount,
					balance_to_pay: res.data.total_after_first_payment,
				},
				discount_symbol: res.data.discount_type === 1 ? '%' : '£',
				title: res.data.title,
				description: res.data.description,
				created_at: res.data.created_at,
				status: res.data.status.toLowerCase(),
				work_items: res.data.work_items
			});
		}
	},[]);

	useEffect(()=>{
		if(id){
			getData();
		}else{
			router.push(`/${role}/contract/manage`);
		}
	},[]);

	const endHandler = useCallback(async (id) => {
		requestWithTokenAsync(
			'post',
			`/contracts/${id}/complete/`,
			token
		).then(res=>{
			if(res?.data){
				setMessage({
					type: 'success',
					body: res.data
				});
				setTimeout(() => {
					router.push(`/${role}/contract/manage`);
				}, 500);
			}else{
				setMessage({
					type: 'error',
					body: res?.error?.response?.data[0] || 'Something went wrong.'
				});
			}
		}).catch(res=>{
			setMessage({
				type: 'error',
				body: res?.error?.response?.data[0] || 'Something went wrong.'
			});
		});
	},[]);

	return (
		<WithTransition>
			<div className='container mx-auto pb-8 mb-6 flex flex-wrap items-start'>
				<SubHeader>
					contract details
				</SubHeader>
				<div className="w-full lg:w-4/12 px-4 mb-4 mt-4 order-2 lg:order-1 lg:mt-0 lg:mb-0">
					<div className="w-full relative flex flex-col min-w-0 p-6 break-words bg-white shadow-xl rounded-lg border-0">
						<h2 className="relative text-slate-600 text-lg font-semibold leading-normal capitalize">
                            Your Property
							<hr className="mb-2 mt-1 border-b-2 border-emerald-300 w-10" />
						</h2>
						{selectedProperty && (
							<ul>
								{Object.entries(selectedProperty).map(item=>{
									if(item[0] === 'profile'){
										if(item[1]?.name){
											return (
												<li className='bg-slate-50 border p-4 rounded-lg' key={item[0]}>
													<StyledLabel label="you" htmlFor="business_user_info" sronly="true" />
													<div className='flex items-center'>
														<span className="w-10 h-10 text-base text-neutral-700 bg-slate-200 inline-flex items-center justify-center rounded-full mr-2">
															<i className="fa-solid fa-user"></i>
														</span>
														<p id="business_user_info" className='capitalize text-xs font-medium max-w-full text-center'>
															{`${item[1].name} ${item[1].surname} ${item[1].title && '('}${item[1].title}${item[1].title && ')'}`}
														</p>
													</div>
												</li>
											);
										}else{
											return null;
										}
									}
									return (
										<li className="my-1 text-slate-600 capitalize text-sm flex items-center" key={item[0]}>
											<StyledLabel htmlFor={item[0]} label={item[0].replace('_',' ')+':'} />
											<span id={item[0]} className='block mb-2 pl-1'>{item[1]}</span>
										</li>
									);
								})}
							</ul>

						)}
					</div>

					<div className="w-full relative flex flex-col min-w-0 p-6 mt-6 break-words bg-white shadow-xl rounded-lg border-0">
						<h2 className="relative text-slate-600 text-lg font-semibold leading-normal capitalize">
                            Business property
							<hr className="mb-2 mt-1 border-b-2 border-emerald-300 w-10" />
						</h2>
						{selectedBusiness && (
							<ul>
								{Object.entries(selectedBusiness).map(item=>{
									if(item[0] === 'website'){
										return (
											<li key={item[0]} className='text-sm'>
												<Link href={item[1]}>
													<a className='indigo-link flex items-center lowercase'>
														<i className='fas fa-earth mb-2 block text-slate-600' />
														<span 
															id={item[0]} 
															className='block mb-2 pl-1'
														>
															{item[1]}
														</span>
													</a>
												</Link>
											</li>
										);
									}else if(item[0] === 'business_name'){
										return (
											<h3 key={item[0]} className='font-medium text-slate-600 mt-2'>
												{item[1]}
											</h3>
										);
									}else if(item[0] === 'separator'){
										return <hr className="mb-2 mt-1 border-b-1 border-slate-300 w-full" key={item[0]} />;
									}else if(item[0] === 'profile'){
										if(item[1]?.name){
											return (
												<li className='bg-slate-50 border p-4 rounded-lg' key={item[0]}>
													<StyledLabel label="you" htmlFor="business_user_info" sronly="true" />
													<div className='flex items-center'>
														<span className="w-10 h-10 text-base text-neutral-700 bg-slate-200 inline-flex items-center justify-center rounded-full mr-2">
															<i className="fa-solid fa-user"></i>
														</span>
														<p id="business_user_info" className='capitalize text-xs font-medium max-w-full text-center'>
															{`${item[1].name} ${item[1].surname} ${item[1].title && '('}${item[1].title}${item[1].title && ')'}`}
														</p>
													</div>
												</li>
											);
										}else{
											return null;
										}
									}
									return (
										<li className="my-1 text-slate-600 capitalize text-sm flex items-center" key={item[0]}>
											<StyledLabel htmlFor={item[0]} label={item[0].replace('_',' ')+':'} />
											<span id={item[0]} className='block mb-2 pl-1'>{item[1]}</span>
										</li>
									);
								})}
							</ul>
						)}
					</div>
				</div>
				<div className='w-full order-1 lg:order-2 lg:w-8/12'>
					{contract && (
						<DetailsCard
							title={contract.title}
							id={contract.id}
							date={contract.created_at}
							status={contract.status}
							data={Boolean(contract.id)}
							extraActions={
								<>
									{contract.status === 'in_progress' && (
										<BorderButton
											clicked={()=>endHandler(contract.id)}
											colorStyles='text-indigo-500 border-indigo-500 hover:bg-indigo-500 active:bg-indigo-600 focus:shadow-indigo-600'
											type='button'
										>
											complete
										</BorderButton>
									)}
									<Link href={`/${role}/contract/pdf?id=${contract.id}`}>
										<a 
											className='ml-2'
											target="_blank"
										>
											<label className='sr-only'>view PDF</label>
											<Image
												src={'/img/pdf.png'}
												alt="pdf"
												width='26px'
												height='30px'
											/>
										</a>
									</Link>
								</>
							}
						>
							{contract.description && (
								<p className='text-sm text-slate-600'>
									{contract.description}
								</p>
							)}
							<div className="flex-auto pt-6">
								<h3 className="relative text-slate-600 text-base font-medium leading-normal capitalize">
									work items
									<hr className="mb-8 mt-1 border-b-2 border-emerald-300 w-10" />
								</h3>
								{contract?.work_items?.map(item=>(
									<div className='w-full inline-block align-top' key={item.id}>
										<ListItem
											key={item.id}
											item={{
												title: item.title,
												subTitle: `£${item.price}`,
												id: item.id
											}}
											comment={item.description}
											shortTitle="true"
											fields={{
												include_in_first_payment: item.include_in_first_payment
											}}
										/>
									</div>
								))}
								<PaymentFields
									data={contract.costs}
									discount_symbol={contract.discount_symbol}
								/>
							</div>
						</DetailsCard>
					)}
					{message?.body && (
						<div className='mb-2 mt-4 mx-4'>
							<Feedback state={message?.type || 'warning'} message={message.body} />
						</div>
					)}
				</div>
			</div>
		</WithTransition>
	);
};
export default ContractDetails;

ContractDetails.auth = true;
ContractDetails.layout = Admin;