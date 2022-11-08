import React from 'react';

const PaymentFields = ({data, discount_symbol}) => {
	return (
		<div className={'justify-end items-end mt-4 flex w-full px-2 lg:px-4'}>
			<div className='w-full lg:w-1/2'>
				{data && Object.keys(data).map(key=>{
					if(discount_symbol !== '%' && key === 'discount_amount'){
						return null;
					}
					if(key === 'first_payment_amount' && data[key] <= 0){
						return null;
					}
					if(key === 'balance_to_pay' && data['first_payment_amount'] <=0){
						return null;
					}
					return (
						<p className='flex items-center w-full justify-between' key={key}>
							<label className='uppercase text-slate-500 text-xs font-bold' htmlFor={key}>
								{key.replace(/_/g,' ')}
								{key === 'vat' || (key === 'discount' && discount_symbol === '%') ? ' (%):' : ':'}
							</label>
							<span id={key} className='ml-1 text-slate-700'>
								{key !== 'vat' && (key !== 'discount' && discount_symbol === '%') && (
									<span className='font-semibold'>£</span>
								)}
								{data[key] || '0.00'}
							</span>
						</p>
					);
				})}
			</div>
		</div>
	);
};

export default PaymentFields;