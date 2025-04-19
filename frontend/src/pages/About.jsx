import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import { IoIosArrowForward } from "react-icons/io";
import { FaCheckCircle, FaUsers, FaShoppingBag, FaTruck, FaHeadset } from "react-icons/fa";

const About = () => {
  // Team members data
  const teamMembers = [
    {
      id: 1,
      name: "John Doe",
      position: "CEO & Founder",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1000&auto=format&fit=crop"
    },
    {
      id: 2,
      name: "Jane Smith",
      position: "Marketing Director",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1000&auto=format&fit=crop"
    },
    {
      id: 3,
      name: "Michael Brown",
      position: "Product Manager",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1000&auto=format&fit=crop"
    },
    {
      id: 4,
      name: "Sarah Johnson",
      position: "Customer Support Lead",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1000&auto=format&fit=crop"
    }
  ];

  return (
    <div className="w-full">
      <Header />

      {/* Banner Section */}
      <section className='bg-[url("http://localhost:3000/images/banner/shop.png")] h-[220px] mt-6 bg-cover bg-no-repeat relative bg-left'>
        <div className='absolute left-0 top-0 w-full h-full bg-[#2422228a]'>
          <div className='w-[85%] md:w-[80%] sm:w-[90%] lg:w-[90%] h-full mx-auto'>
            <div className='flex flex-col justify-center gap-1 items-center h-full w-full text-white'>
              <h2 className='text-3xl font-bold'>About Us</h2>
              <div className='flex justify-center items-center gap-2 text-2xl w-full'>
                <Link to='/'>Home</Link>
                <span className='pt-1'>
                  <IoIosArrowForward />
                </span>
                <span>About Us</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Content */}
      <section className='py-16'>
        <div className='w-[85%] md:w-[80%] sm:w-[90%] lg:w-[90%] mx-auto'>
          {/* Our Story */}
          <div className='flex flex-wrap items-center mb-16'>
            <div className='w-1/2 md-lg:w-full md-lg:mb-8'>
              <img
                src="http://localhost:3000/images/banner/shop.png"
                alt="About Us"
                className='w-full h-auto rounded-lg shadow-md'
              />
            </div>
            <div className='w-1/2 md-lg:w-full pl-12 md-lg:pl-0'>
              <h2 className='text-3xl font-bold text-slate-700 mb-6'>Our Story</h2>
              <p className='text-slate-600 mb-4'>
                Founded in 2020, Easy Shop has quickly established itself as a leading e-commerce platform,
                offering a wide range of high-quality products at competitive prices. Our journey began with
                a simple mission: to make online shopping easy, enjoyable, and accessible to everyone.
              </p>
              <p className='text-slate-600 mb-6'>
                What started as a small venture has now grown into a trusted marketplace with thousands of
                satisfied customers. We take pride in our curated selection of products, exceptional customer
                service, and commitment to innovation.
              </p>
              <ul className='flex flex-col gap-3'>
                <li className='flex items-center gap-2 text-slate-600'>
                  <FaCheckCircle className='text-[#059473]' />
                  <span>Wide range of carefully selected products</span>
                </li>
                <li className='flex items-center gap-2 text-slate-600'>
                  <FaCheckCircle className='text-[#059473]' />
                  <span>Fast and reliable shipping worldwide</span>
                </li>
                <li className='flex items-center gap-2 text-slate-600'>
                  <FaCheckCircle className='text-[#059473]' />
                  <span>Dedicated customer support team</span>
                </li>
                <li className='flex items-center gap-2 text-slate-600'>
                  <FaCheckCircle className='text-[#059473]' />
                  <span>Secure payment methods</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Why Choose Us */}
          <div className='mb-16'>
            <div className='text-center mb-12'>
              <h2 className='text-3xl font-bold text-slate-700 mb-4'>Why Choose Us</h2>
              <p className='text-slate-600 w-2/3 mx-auto md:w-full'>
                At Easy Shop, we strive to provide the best shopping experience possible.
                Here's what sets us apart from other online retailers.
              </p>
            </div>
            <div className='grid grid-cols-4 md-lg:grid-cols-2 sm:grid-cols-1 gap-6'>
              <div className='bg-white p-6 rounded-lg shadow-sm text-center hover:shadow-md transition-all'>
                <div className='w-16 h-16 bg-[#dbf3ed] rounded-full flex items-center justify-center mx-auto mb-4'>
                  <FaUsers className='text-2xl text-[#059473]' />
                </div>
                <h3 className='text-xl font-bold text-slate-700 mb-2'>Customer First</h3>
                <p className='text-slate-600'>
                  Our customers are at the heart of everything we do. We continuously improve our services based on your feedback.
                </p>
              </div>
              <div className='bg-white p-6 rounded-lg shadow-sm text-center hover:shadow-md transition-all'>
                <div className='w-16 h-16 bg-[#dbf3ed] rounded-full flex items-center justify-center mx-auto mb-4'>
                  <FaShoppingBag className='text-2xl text-[#059473]' />
                </div>
                <h3 className='text-xl font-bold text-slate-700 mb-2'>Quality Products</h3>
                <p className='text-slate-600'>
                  We carefully select each product in our inventory to ensure it meets our high standards of quality.
                </p>
              </div>
              <div className='bg-white p-6 rounded-lg shadow-sm text-center hover:shadow-md transition-all'>
                <div className='w-16 h-16 bg-[#dbf3ed] rounded-full flex items-center justify-center mx-auto mb-4'>
                  <FaTruck className='text-2xl text-[#059473]' />
                </div>
                <h3 className='text-xl font-bold text-slate-700 mb-2'>Fast Delivery</h3>
                <p className='text-slate-600'>
                  We partner with reliable shipping providers to ensure your orders are delivered promptly and safely.
                </p>
              </div>
              <div className='bg-white p-6 rounded-lg shadow-sm text-center hover:shadow-md transition-all'>
                <div className='w-16 h-16 bg-[#dbf3ed] rounded-full flex items-center justify-center mx-auto mb-4'>
                  <FaHeadset className='text-2xl text-[#059473]' />
                </div>
                <h3 className='text-xl font-bold text-slate-700 mb-2'>24/7 Support</h3>
                <p className='text-slate-600'>
                  Our dedicated support team is always ready to assist you with any questions or concerns.
                </p>
              </div>
            </div>
          </div>

          {/* Our Team */}
          <div>
            <div className='text-center mb-12'>
              <h2 className='text-3xl font-bold text-slate-700 mb-4'>Meet Our Team</h2>
              <p className='text-slate-600 w-2/3 mx-auto md:w-full'>
                The passionate individuals behind Easy Shop who work tirelessly to bring you the best shopping experience.
              </p>
            </div>
            <div className='grid grid-cols-4 md-lg:grid-cols-2 sm:grid-cols-1 gap-6'>
              {teamMembers.map(member => (
                <div key={member.id} className='bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all'>
                  <div className='h-[250px] overflow-hidden'>
                    <img
                      src={member.image}
                      alt={member.name}
                      className='w-full h-full object-cover transition-all duration-500 hover:scale-110'
                    />
                  </div>
                  <div className='p-4 text-center'>
                    <h3 className='text-xl font-bold text-slate-700'>{member.name}</h3>
                    <p className='text-[#059473]'>{member.position}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
