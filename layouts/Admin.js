import React, {useState, useEffect} from 'react';

// components
import Sidebar from '../components/Navbars/Sidebar.js';
import Footer from '../components/footer.js';
import Header from '../components/header.js';
import StyledModal from '../components/UI/styledModal.js';
import { useRouter } from 'next/router.js';
import ToDo from '../components/lists/ToDo/index.js';

const Admin = ({ children, userData, token }) => {
	const router = useRouter();
	const {notes} = router.query;
	const currentPath = router.currentPath;
	const currentQuery = {...router.query};
	const [isNotesOpen, setIsNotesOpen] = useState(false);
	const [data, setData] = useState([]);


	useEffect(() => {
		if(notes){
			setIsNotesOpen(true);
		}else{
			setIsNotesOpen(false);
		}
	}, [notes]);

	return (
		<>
			<Header user={userData} />
			<div className="relative bg-slate-100 pt-12">
				<Sidebar user={userData} token={token} />
				<div className='min-height-admin md:ml-64 flex flex-col pb-20'>
					<main className='flex-1'>
						<div className="w-full min-height-screen relative before:content-[''] before:block before:w-full before:h-[9.5rem] before:absolute before:top-0 before:left-0 before:bg-gradient-to-br before:from-rose-300 before:to-indigo-600 before:opacity-50">
							{children}
						</div>
						<StyledModal
							open={isNotesOpen}
							onClose={()=>{
								if(!currentQuery.notes){
									currentQuery.notes ='open';
								}else{
									delete currentQuery['notes'];
								}
								router.push({
									pathname: currentPath,
									query: currentQuery
								});
							}}
							background='bg-gradient-to-br from-rose-200/30 via-violet-400/30 to-emerald-400/30'
							closebutton="true"
							title="to do"
							height = '500px'
							aria-labelledby="TO Do"
							aria-describedby="your to do list"
						>
							<div  className='flex w-[650px]  max-w-full px-4 '>
								<ToDo data={data} setData={setData} userData={userData} />
							</div>

						</StyledModal>
					</main>
					<Footer />
				</div>
			</div>
		</>
	);
};

export default Admin;
