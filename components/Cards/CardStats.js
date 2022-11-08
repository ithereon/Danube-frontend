import React from 'react';

export default function CardStats({
	statTitle,
	statAmount,
	statArrow,
	statPercent,
	statPercentColor,
	statDescripiron,
	statIconName,
	statIconColor,
	statTotal
}) {
	return (
		<>
			<div className="relative flex flex-col min-w-0 break-words bg-white rounded shadow-lg mb-6 xl:mb-0 xl:h-full">
				<div className="flex-auto flex flex-col justify-between py-4 px-3">
					<div className="flex flex-wrap">
						<div className="relative w-full max-w-full flex-grow flex-1">
							<h5 className="text-blueGray-400 uppercase font-bold text-xs">
								{statTitle}
							</h5>
							<span className="font-semibold text-xl text-blueGray-700">
								{statAmount}
							</span>
						</div>
						<div className="relative w-auto pl-2 flex-initial">
							<div
								className={
									'text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full ' + statIconColor
								}
							>
								<i className={statIconName}></i>
							</div>
						</div>
					</div>
					{statPercent && (
						<p className="text-sm text-blueGray-400 mt-4">
							<span className={statPercentColor + ' mr-2'}>
								<i
									className={
										statArrow === 'up'
											? 'fas fa-arrow-up'
											: statArrow === 'down'
												? 'fas fa-arrow-down'
												: ''
									}
								></i>{' '}
								{statPercent}%
							</span>
							<span className="whitespace-nowrap">{statDescripiron}</span>
						</p>
					)}
					{statTotal && (
						<p className="text-sm text-blueGray-400 mt-4">
							<span className={'mr-1'}>
								£{statTotal}
							</span>
							<span className="whitespace-nowrap">total</span>
						</p>
					)}
				</div>
			</div>
		</>
	);
}