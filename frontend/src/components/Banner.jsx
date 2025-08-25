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

    // Fetch campaigns for hero
    const [slides, setSlides] = React.useState([]);
    React.useEffect(() => {
      const fallback = [
        { id: 'placeholder', image: 'https://dummyimage.com/1600x640/5a51d8/ffffff&text=Your+Campaign+Banner', label: 'EasyShop', link: '/products', titleSize: 48, textColor: '#fff' },
      ];
      fetch((process.env.REACT_APP_API_URL || 'http://localhost:5001/api') + '/campaigns/public')
        .then(r => r.json())
        .then(d => {
          const mapped = (d.campaigns || []).map(c => ({
            id: c._id,
            image: c.image,
            label: c.title,
            link: c.ctaLink || '/products',
            titleSize: c.titleSize || 48,
            textColor: c.textColor || '#ffffff'
          }));
          setSlides(mapped.length ? mapped : fallback);
        })
        .catch(() => setSlides(fallback));
    }, []);

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
                            className="font-extrabold tracking-[4px]"
                            style={{ textShadow: '0 2px 8px rgba(0,0,0,0.65)', color: slide.textColor, fontSize: slide.titleSize }}
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