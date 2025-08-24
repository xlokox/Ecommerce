import React from 'react';
import Carousel from 'react-multi-carousel';
import { Link } from 'react-router-dom';
import 'react-multi-carousel/lib/styles.css'
import { useSelector } from 'react-redux';

const Categorys = () => {
    // Get categorys from state with a default empty array
    const { categorys = [] } = useSelector(state => state.home || { categorys: [] })

    // If categorys is not an array or is empty, return null or a placeholder
    if (!Array.isArray(categorys) || categorys.length === 0) {
        return (
            <div className='w-[87%] mx-auto relative'>
                <div className='w-full'>
                    <div className='text-center flex justify-center items-center flex-col text-3xl text-slate-600 font-bold relative pb-[35px]'>
                        <h2>Shop by Category</h2>
                        <div className='w-[100px] h-[2px] bg-[#059473] mt-4'></div>
                    </div>
                    <div className='text-center text-gray-500 py-4'>No categories available at the moment.</div>
                </div>
            </div>
        );
    }

    const responsive = {
        superLargeDesktop: {
            breakpoint: { max: 4000, min: 3000 },
            items: 5
        },
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 4
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 3
        },
        mdtablet: {
            breakpoint: { max: 991, min: 464 },
            items: 3
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 2
        },
        smmobile: {
            breakpoint: { max: 640, min: 0 },
            items: 2
        },
        xsmobile: {
            breakpoint: { max: 440, min: 0 },
            items: 1
        },
    }



    return (
        <div className='w-[87%] mx-auto relative'>
            <div className='w-full'>
            <div className='text-center flex justify-center items-center flex-col text-3xl text-slate-600 font-bold relative pb-[35px]'>
                <h2>Shop by Category</h2>
                <div className='w-[100px] h-[2px] bg-[#059473] mt-4'></div>
            </div>
            </div>

                <Carousel
                    autoPlay={true}
                    infinite={true}
                    arrows={false}
                    responsive={responsive}
                    itemClass="px-1 md:px-2"
                    containerClass="pb-0"
                    transitionDuration={500}
                >
                {
                    categorys.map((c, i) => (
                        <Link
                            data-cy={`category-link-${i}`}
                            className='block w-11/12 mx-auto h-[160px] rounded-2xl overflow-hidden shadow-md'
                            key={i}
                            to={`/products?category=${c.name}`}
                        >
                            <div className='relative w-full h-full'>
                                <img
                                  data-cy={`category-image-${i}`}
                                  src={c.image}
                                  alt={c.name}
                                  className='w-full h-full object-cover'
                                />
                                <div className='absolute inset-0 bg-black/40'></div>
                                <div className='absolute inset-0 flex items-center justify-center'>
                                  <span className='text-white text-sm md:text-base font-bold text-center drop-shadow'>
                                    {c.name}
                                  </span>
                                </div>
                            </div>
                        </Link>
                    ))
                }
                </Carousel>
         </div>

    );
};

export default Categorys;