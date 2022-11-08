import React, {useCallback, useEffect, useState} from 'react';
import {useRouter} from 'next/dist/client/router';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { requestWithTokenAsync } from '../../lib/axios.js';
import useForm from '../../lib/hooks/useForm.js';

// layout for page
import Admin from '../../layouts/Admin.js';
import { WithTransition } from '../../components/wrappers/withTransition.js';
import { SubHeader } from '../../components/subHeader.js';

// components
import Loading from '../../components/UI/loading.js';
import CardProfile from '../../components/Cards/CardProfile.js';
import Button from '../../components/UI/button.js';
import Input from '../../components/UI/input';
import StyledSelect from '../../components/UI/styledSelect.js';
import Feedback from '../../components/UI/feedback.js';


const Settings = ({userData, token, role}) => {
	const router = useRouter();
	const [titleOptions, setTitleOptions] = useState([]);
	const [profile, setProfile] = useState();
	const [message, setMessage] = useState();

	const fetchUserData = useCallback(async() => {
		const res = await requestWithTokenAsync(
			'get',
			`/accounts/${userData.id}/`,
			token
		);
		if(res?.data?.id){
			const profileData = {
				...res.data,
				first_name: res.data.first_name ? res.data.first_name : userData.username,
			};
			Object.keys(profileData).forEach(key => {
				if (profileData[key] === null || profileData[key] === '') {
					delete profileData[key];
				}
			});
			setProfile(profileData);
			formik.setValues({
				'first_name': profileData.first_name ? profileData.first_name : values.first_name,
				'last_name': profileData.last_name ? profileData.last_name : values.last_name,
				'title': profileData.title ? profileData.title : values.title,
				'mobile': profileData.mobile ? profileData.mobile : values.mobile
			});
		}else{
			setProfile(userData);
			formik.setFieldValue('first_name', userData.username);
		}
	},[]);

	useEffect(() => {
		fetchUserData();
		const fetchTitles = async () => {
			const res = await requestWithTokenAsync(
				'get',
				'/titles/',
				token
			);
			if(res?.data){
				var titleObjs = [];

				res.data.forEach(item => {
					titleObjs.push({
						value: item,
						name: item
					});
				});
				setTitleOptions([...titleObjs]);
			}
		};
		fetchTitles();
	}, []);

	const formik = useFormik({
		initialValues: {
			first_name: '',
			last_name: '',
			title: titleOptions[0]?.name || 'Mr',
			mobile: ''
		},
		validationSchema: Yup.object({
			first_name: Yup.string().required('This field may not be blank.'),
			last_name: Yup.string().required('This field may not be blank.'),
			title: Yup.string().oneOf([
				...titleOptions.map((option) => option.name),
			]),
			mobile: Yup.string().required('This field may not be blank.')
		}),
		onSubmit: async (values, {setSubmitting, resetForm}) => {
			setSubmitting(true);
			const res = await requestWithTokenAsync(
				'patch',
				`/accounts/${userData.id}/`,
				token,
				{
					...values,
					user: userData.id
				}
			);
			if(res?.data?.id){
				fetchUserData();
				resetForm();
				setMessage({
					body: 'Your profile has been updated',
					type: 'success'
				});
				setTimeout(() => {
					router.replace({
						pathname: `/${role}`,
					}).then(() => router.reload());
				}, 1000);
			}else{
				setMessage({
					body: 'Something went wrong',
					type: 'error',
					list: res?.error?.response?.data
				});
			}
			setSubmitting(false);
		},
	});

	const {
		isError,
		errors,
		title
	} = useForm(formik);
	
	const {
		values, handleChange, handleBlur, 
		handleSubmit, isSubmitting
	} = formik;

	const onSelectChange = useCallback((e) => {
		formik.setFieldValue('title',e.target.value);
	},[]);

	return (
		<WithTransition>
			<div className='container mx-auto pb-8 mb-6 flex flex-wrap'>
				<SubHeader>
					contact details
				</SubHeader>
						
				<div className="w-full lg:w-4/12 px-4 mb-4 lg:mb-0">
					<div>
						<CardProfile 
							user={profile}
						/>
					</div>
				</div>
				<div className="w-full lg:w-8/12 px-4">
					<div className="relative flex flex-col min-w-0 break-words w-full shadow-lg rounded-lg bg-slate-100 border-0">
						<div className="rounded-t bg-white mb-0 px-6 py-6">
							<div className="text-center flex justify-between">
								<h2 className="text-slate-600 text-lg font-semibold capitalize">
									Update contact details
								</h2>
							</div>
						</div>
						<div className="flex-auto px-4 lg:px-10 py-10">
							{(titleOptions?.length > 0) ? (
								<form noValidate onSubmit={handleSubmit}>
									<div className="flex flex-wrap">
										<div className="w-full lg:w-6/12 px-4">
											<div className="relative w-full mb-3 mt-5 lg:mt-0">
												<Input
													label="First Name"
													name="first_name"
													value={values.first_name}
													onChange={handleChange}
													onBlur={handleBlur}
													required
												/>
												{((isError && errors?.first_name) || message?.list?.first_name) && (
													<span className='err truncate max-w-full'>{errors?.first_name ? errors.first_name : message.list.first_name}</span>
												)}
											</div>
										</div>
										<div className="w-full lg:w-6/12 px-4">
											<div className="relative w-full mb-3 mt-5 lg:mt-0">
												<Input
													label="Last Name"
													name="last_name"
													value={values.last_name}
													onChange={handleChange}
													onBlur={handleBlur}
													required
												/>
												{((isError && errors?.last_name) || message?.list?.last_name) && (
													<span className='err truncate max-w-full'>{errors?.last_name ? errors.last_name : message.list.last_name}</span>
												)}
											</div>
										</div>
										<div className="w-full lg:w-6/12 px-4">
											<div className="relative w-full mb-3 mt-5">
												<input 
													type="hidden" 
													name="title"
													value={values.title}
													onChange={handleChange}
													onBlur={handleBlur}
												/>									
												<StyledSelect
													label="Title"
													name="title"
													options={titleOptions}
													value={values.title}
													onChange={onSelectChange}
												/>
												{((isError && errors?.title) || message?.list?.title) && (
													<span className='err truncate max-w-full'>{errors?.title ? errors.title : message.list.title}</span>
												)}
											</div>
										</div>
										<div className="w-full lg:w-6/12 px-4">
											<div className="relative w-full  mb-3 mt-5">
												<Input 
													label="Mobile"
													name="mobile"
													type="number"
													value={values.mobile}
													onChange={handleChange}
													onBlur={handleBlur}
													required
												/>
												{((isError && errors?.mobile) || message?.list?.mobile) && (
													<span className='err truncate max-w-full'>{errors?.mobile ? errors.mobile : message.list.mobile}</span>
												)}
											</div>
										</div>
										<div className="w-full flex justify-end mt-4">
											<div className='w-full px-4 lg:w-6/12'>
												<Button
													type="submit"
													full="true"
													withLoader={isSubmitting}
												>
													Update
												</Button>
											</div>
										</div>
									</div>
								</form>
							) : <Loading />}
						</div>
					</div>
					{(isError || message?.body) && (
						<div className="mt-4 w-full">
							<Feedback state={isError ? 'error' : message?.type} message={title || message.body} />
						</div>
					)}
				</div>
			</div>

		</WithTransition>
	);
};
export default Settings;

Settings.auth = true;
Settings.layout = Admin;