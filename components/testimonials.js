
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';
import sanitizeHtml from 'sanitize-html';

const Testimonials = (props) => {
	return (
		<Carousel
			showArrows={true}
			infiniteLoop={true}
			showThumbs={false}
			showStatus={false}
			// autoPlay={true}
			interval={6100}
			preventMovementUntilSwipeScrollTolerance={true}
			swipeScrollTolerance={50}
		>
			{props?.data?.length > 0 && props.data?.map(slideContent => (
				<div key={slideContent.name} className='flex flex-col items-center justify-center px-7 py-7 sm:px-10 sm:py-10 bg-white rounded mb-6 xl:mb-0 shadow-lg text-xl myCarousel'>
					<i className="fas fa-quote-right icon absolute -top-2 text-indigo-500 font-bold text-5xl"></i>
					<strong className='text-2xl text-neutral-800 font-normal'>{slideContent.name}</strong>
					<div className='text-sm text-indigo-600 font-semibold my-2'>
						{slideContent.title}
					</div>
					{slideContent.content && (
						<div className='h-[31.5rem] xxs:h-[24.5rem] sm:h-[13.5rem] md:h-[18rem] lg:h-[13.5rem] xl:h-[10.5rem]'>
							<div 
								className='relative text-neutral-500 text-base font-light leading-6 max-h-[31.5rem] xxs:max-h-[24rem] sm:max-h-[13.5rem] md:max-h-[18rem] lg:max-h-[13.5rem] xl:max-h-[10.5rem] text-justify overflow-hidden -mr-4 pr-4 before:content-["..."] before:absolute before:right-0 before:bottom-0 after:content-[""] after:absolute after:right-0 after:w-4 after:h-4 after:mt-1 after:bg-white'
								dangerouslySetInnerHTML={{ 
									__html: sanitizeHtml(slideContent.content, {
										allowedTags: [ 'strong', 'a' ],
										allowedAttributes: {
											'a': [ 'href', 'target' ]
										}
									}) 
								}} />
						</div>
					)}
				</div>
			))}
		</Carousel>
	);
};

export default Testimonials;