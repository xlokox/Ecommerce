import React, { useEffect } from 'react';
import Carousel from 'react-multi-carousel';
import { Link } from 'react-router-dom';
// Import the base carousel styles
import 'react-multi-carousel/lib/styles.css';
// Import our custom override styles (to fix deprecation warnings)
import '../styles/carousel-override.css';
import { useSelector } from 'react-redux';

const Banner = () => {
    // Get banners from Redux store with a default empty array
    const { banners = [] } = useSelector(state => state.home || { banners: [] });

    // Debug: Log banners to see what we're getting
    useEffect(() => {
        if (banners && banners.length > 0) {
            console.log('Banner component - banners loaded:', banners.length);
        }
    }, [banners]);

    const responsive = {
         superLargeDesktop: {
             breakpoint: { max: 4000, min: 3000 },
             items: 1
         },
         desktop: {
             breakpoint: { max: 3000, min: 1024 },
             items: 1
         },
         tablet: {
             breakpoint: { max: 1024, min: 464 },
             items: 1
         },
         mobile: {
             breakpoint: { max: 464, min: 0 },
             items: 1
         },
     }



     return (
         <div className='w-full md-lg:mt-6'>
             <div className='w-[85%] lg:w-[90%] mx-auto'>
                 <div className='w-full flex flex-wrap md-lg:gap-8'>
                     <div className='w-full'>
                         <div className='my-8'>
                 <Carousel
                     autoPlay={true}
                     infinite={true}
                     arrows={true}
                     showDots={true}
                     responsive={responsive}
                 >
                 {
                     // Use banners from Redux store if available, otherwise use static images
                     banners && banners.length > 0 ? (
                         banners.map((banner, i) => (
                             <Link key={i} to={banner.link || '#'}>
                                 <img
                                    src={banner.banner}
                                    alt={banner.title || 'Banner'}
                                    className="w-full h-[300px] object-cover rounded-md"
                                    onError={(e) => {
                                        console.error('Banner image failed to load:', banner.banner);
                                        e.target.src = 'http://localhost:3000/images/banner/1.jpg';
                                    }}
                                 />
                             </Link>
                         ))
                     ) : (
                         // Fallback to static images if no banners are available
                         [1,2,3,4,5,6].map((img, i) => (
                             <Link key={i} to='#'>
                                 <img
                                    src={`http://localhost:3000/images/banner/${img}.jpg`}
                                    alt="Banner"
                                    className="w-full h-[300px] object-cover rounded-md"
                                    onError={(e) => {
                                        console.error(`Fallback banner image failed to load: ${img}.jpg`);
                                        e.target.src = 'http://localhost:3000/images/banner/1.jpg';
                                    }}
                                 />
                             </Link>
                         ))
                     )
                 }
                 </Carousel>
                         </div>
                     </div>
                 </div>
             </div>
         </div>
     );
 };

 export default Banner;