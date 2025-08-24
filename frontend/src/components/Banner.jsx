import React from 'react';
import Carousel from 'react-multi-carousel';
import { Link } from 'react-router-dom';
// Import the base carousel styles
import 'react-multi-carousel/lib/styles.css';
// Import our custom override styles (to fix deprecation warnings)
import '../styles/carousel-override.css';
import { useSelector } from 'react-redux';

const Banner = () => {
    // Get categories to build links that match the app
    const { categorys = [] } = useSelector(state => state.home || { categorys: [] });

    const getCategoryIdByName = (name) => {
      const cat = categorys.find(c => (c.name || '').toLowerCase() === name.toLowerCase());
      return cat?._id || '';
    };

    // Slides synced with the mobile app
    const slides = [
      {
        id: 'sale',
        image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=2940&q=80',
        label: 'Our Latest Deals',
        link: '/products?'
      },
      {
        id: 'electronics',
        image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=2940&q=80',
        label: 'Our Newst Electronics',
        link: `/products?category=${getCategoryIdByName('Electronics')}`
      },
      {
        id: 'toys',
        image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=1600&q=80',
        label: 'Our Newst Toys',
        link: `/products?category=${getCategoryIdByName('Toys')}`
      }
    ];

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
                 {slides.map((slide) => (
                    <Link key={slide.id} to={slide.link}>
                      <div className="relative">
                        <img
                          src={slide.image}
                          alt={slide.label}
                          className="w-full h-[400px] sm:h-[460px] md:h-[520px] lg:h-[640px] xl:h-[720px] object-cover rounded-md"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span
                            className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-[4px]"
                            style={{ textShadow: '0 2px 8px rgba(0,0,0,0.65)' }}
                          >
                            {slide.label}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                 </Carousel>
                         </div>
                     </div>
                 </div>
             </div>
         </div>
     );
 };

 export default Banner;