import React from 'react';
import { signOut } from 'next-auth/react';
import useProfileComplete from '../../lib/hooks/useProfileComplete.js';

// layout for page
import Admin from '../../layouts/Admin.js';
import { WithTransition } from '../../components/wrappers/withTransition.js';
import { SubHeader } from '../../components/subHeader.js';

// components
import Feedback from '../../components/UI/feedback.js';
import HeaderStats from '../../components/HeaderStats.js';
import CardLineChart from '../../components/Cards/CardLineChart.js';

const Dashboard = ({userData, token}) => {
	const {hasProperty, data} = useProfileComplete(userData.id, token);
	return (
		<div className='container mx-auto pb-8 mb-6 flex flex-wrap items-stretch'>
			<WithTransition>
				<SubHeader>
					Dashboard
				</SubHeader>
				<div className='px-2 lg:px-4'>
					<div className="relative flex flex-col min-w-0 break-words w-full h-full">
						<HeaderStats />
						<div className="flex flex-wrap">
							<div className="w-full xl:w-1/2 xl:pr-2">
								<CardLineChart
									title="Open contracts by month"
									id="open-contract"
									endpoint="/"
									color="#eab308"
								/>
							</div>
							<div className="w-full xl:w-1/2 xl:pl-2">
								<CardLineChart 
									title="Complete contracts by month"
									id="complete-contracts"
									endpoint="/"
									color="#6366f1"
								/>
							</div>
						</div>
						<div className="flex flex-wrap mt-4">
							<div className="w-full xl:w-1/2 xl:pr-2">
								<CardLineChart 
									title="Open invoices by month"
									id="open-invoice" 
									endpoint="/"
									color="#16a34a"
								/>
							</div>
							<div className="w-full xl:w-1/2 xl:pl-2">
								<CardLineChart 
									title="Complete invoices by month"
									id="complete-invoice" 
									endpoint="/"
									color="#0284c7"
								/>
							</div>
						</div>
					</div>
					{(data && (
						hasProperty !== userData.is_property_created || 
						userData.last_name !== data.last_name || 
						userData.first_name !== data.first_name ||
						userData.mobile !== data.mobile ||
						userData.title !== data.title
					)) && (
						<div className='mt-2'>
							<Feedback state='warning' message={(
								<>
									You have updated important details of your profile, please <button className='underline uppercase' onClick={()=>signOut({ callbackUrl: '/auth/login' })}>reauthenticate</button> to see full effect
								</>
							)} />
						</div>
					)}
				</div>
			</WithTransition>
		</div>
	);
};
export default Dashboard;

Dashboard.auth = true;
Dashboard.layout = Admin;
