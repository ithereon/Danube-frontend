import React, { useState, useEffect, useCallback } from 'react';
import Chart from 'chart.js';
import StyledSelect from '../UI/styledSelect';

const CardLineChart = ({id, title, color, endpoint}) => {
	const currentYear = new Date().getFullYear()+'';
	const [selectedYear, setSelectedYear] = useState(currentYear);
	const [data, setData] = useState();

	useEffect(()=>{
		const getData = async () => {
			// request data and set here
			console.log('url', endpoint);
			setData([
				{
					label: '2022',
					backgroundColor: color || '#ef4444',
					borderColor: color || '#ef4444',
					data: [120, 78, 66, 44, 56, 67, 75, 10, 40, 82, 39, 28],
					fill: false,
				},
				{
					label: '2021',
					backgroundColor: color || '#ef4444',
					borderColor: color || '#ef4444',
					data: [65, 78, 66, 44, 56, 67, 75, 10, 40, 82, 39, 50],
					fill: false,
				}
			]);
		};
		getData();
	},[]);

	useEffect(() => {
		if(data){
			const config = {
				type: 'line',
				data: {
					labels: [
						'Jan',
						'Feb',
						'Mar',
						'Apr',
						'May',
						'Jun',
						'Jul',
						'Aug',
						'Sep',
						'Oct',
						'Nov',
						'Dec'
					],
					datasets: [
						{
							...data.find(e=>e.label === selectedYear)
						}
					],
				},
				options: {
					// maintainAspectRatio: false,
					responsive: true,
					plugins: {
						title: {
							display: true,
							text: 'OPEN CONTRACTS BY MONTH',
							fontColor: '#333',
						}
					},
					legend: {
						display: false,
						labels: {
							fontColor: '#333',
						},
						align: 'end',
						position: 'bottom',
					},
					tooltips: {
						mode: 'index',
						intersect: false,
					},
					hover: {
						mode: 'nearest',
						intersect: true,
					},
					scales: {
						y: {
							// type: 'linear',
							suggestedMin: 30,
							suggestedMax: 50,
						},
					},
				},
			};
			const ctx = document.getElementById(id).getContext('2d');
			const chrt = new Chart(ctx, config);
			window.myLine = chrt;

			return () => chrt.destroy();
		}
	}, [selectedYear, data]);

	const onSelectChange = useCallback((e)=>{
		setSelectedYear(e.target.value);
	},[]);

	return (
		<>
			<div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white">
				<div className="rounded-t mb-0 px-4 pb-3 pt-4 bg-transparent">
					<div className="flex flex-wrap items-center">
						<div className="relative w-full max-w-full flex-grow flex-1">
							<h2 className='relative text-slate-600 text-base leading-5 font-semibold uppercase lg:text-lg lg:leading-normal'>
								{title}
								<hr className="mt-2 border-b-2 border-emerald-300 w-10" />
							</h2>
						</div>
						<div>
							{data && (
								<StyledSelect
									name="year"
									options={[
										...data.map(e=>({value: e.label, name: e.label}))
									]}
									value={selectedYear}
									onChange={onSelectChange}
								/>
							)}
						</div>
					</div>
				</div>
				<div className="p-4 flex-auto">
					<div className="relative">
						<canvas height={'135px'} width={'450px'} id={id}/>
					</div>
				</div>
			</div>
		</>
	);
};

export default CardLineChart;
