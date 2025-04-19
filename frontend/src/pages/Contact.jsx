import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import { IoIosArrowForward } from "react-icons/io";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaClock, FaFacebookF, FaTwitter, FaLinkedin, FaGithub } from "react-icons/fa";
import toast from 'react-hot-toast';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', formData);
    toast.success('Message sent successfully! We will get back to you soon.');
    // Reset form
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  return (
    <div className="w-full">
      <Header />
      
      {/* Banner Section */}
      <section className='bg-[url("http://localhost:3000/images/banner/shop.png")] h-[220px] mt-6 bg-cover bg-no-repeat relative bg-left'>
        <div className='absolute left-0 top-0 w-full h-full bg-[#2422228a]'>
          <div className='w-[85%] md:w-[80%] sm:w-[90%] lg:w-[90%] h-full mx-auto'>
            <div className='flex flex-col justify-center gap-1 items-center h-full w-full text-white'>
              <h2 className='text-3xl font-bold'>Contact Us</h2>
              <div className='flex justify-center items-center gap-2 text-2xl w-full'>
                <Link to='/'>Home</Link>
                <span className='pt-1'>
                  <IoIosArrowForward />
                </span>
                <span>Contact Us</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className='py-16'>
        <div className='w-[85%] md:w-[80%] sm:w-[90%] lg:w-[90%] mx-auto'>
          {/* Contact Info Cards */}
          <div className='grid grid-cols-4 md-lg:grid-cols-2 sm:grid-cols-1 gap-6 mb-16'>
            <div className='bg-white p-6 rounded-lg shadow-sm text-center hover:shadow-md transition-all'>
              <div className='w-16 h-16 bg-[#dbf3ed] rounded-full flex items-center justify-center mx-auto mb-4'>
                <FaMapMarkerAlt className='text-2xl text-[#059473]' />
              </div>
              <h3 className='text-xl font-bold text-slate-700 mb-2'>Our Location</h3>
              <p className='text-slate-600'>
                Tel Aviv Dizingoff Street<br />
                Israel
              </p>
            </div>
            <div className='bg-white p-6 rounded-lg shadow-sm text-center hover:shadow-md transition-all'>
              <div className='w-16 h-16 bg-[#dbf3ed] rounded-full flex items-center justify-center mx-auto mb-4'>
                <FaPhoneAlt className='text-2xl text-[#059473]' />
              </div>
              <h3 className='text-xl font-bold text-slate-700 mb-2'>Phone Number</h3>
              <p className='text-slate-600'>
                +(972) 54 735 0205<br />
                +9723132412
              </p>
            </div>
            <div className='bg-white p-6 rounded-lg shadow-sm text-center hover:shadow-md transition-all'>
              <div className='w-16 h-16 bg-[#dbf3ed] rounded-full flex items-center justify-center mx-auto mb-4'>
                <FaEnvelope className='text-2xl text-[#059473]' />
              </div>
              <h3 className='text-xl font-bold text-slate-700 mb-2'>Email Address</h3>
              <p className='text-slate-600'>
                support@easyshop.com<br />
                info@easyshop.com
              </p>
            </div>
            <div className='bg-white p-6 rounded-lg shadow-sm text-center hover:shadow-md transition-all'>
              <div className='w-16 h-16 bg-[#dbf3ed] rounded-full flex items-center justify-center mx-auto mb-4'>
                <FaClock className='text-2xl text-[#059473]' />
              </div>
              <h3 className='text-xl font-bold text-slate-700 mb-2'>Working Hours</h3>
              <p className='text-slate-600'>
                Monday - Friday: 9am - 5pm<br />
                Weekend: 10am - 2pm
              </p>
            </div>
          </div>

          {/* Contact Form and Map */}
          <div className='flex flex-wrap'>
            {/* Contact Form */}
            <div className='w-1/2 md-lg:w-full md-lg:mb-10 pr-8 md-lg:pr-0'>
              <h2 className='text-3xl font-bold text-slate-700 mb-6'>Get In Touch</h2>
              <p className='text-slate-600 mb-6'>
                Have a question, feedback, or need assistance? Fill out the form below and we'll get back to you as soon as possible.
              </p>
              <form onSubmit={handleSubmit}>
                <div className='mb-4'>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your Name *"
                    required
                    className='w-full h-[50px] border border-slate-300 rounded-md px-4 outline-none focus:border-[#059473]'
                  />
                </div>
                <div className='mb-4'>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Your Email *"
                    required
                    className='w-full h-[50px] border border-slate-300 rounded-md px-4 outline-none focus:border-[#059473]'
                  />
                </div>
                <div className='mb-4'>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Subject"
                    className='w-full h-[50px] border border-slate-300 rounded-md px-4 outline-none focus:border-[#059473]'
                  />
                </div>
                <div className='mb-4'>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Your Message *"
                    required
                    rows="5"
                    className='w-full border border-slate-300 rounded-md p-4 outline-none focus:border-[#059473]'
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className='px-8 py-3 bg-[#059473] text-white rounded-md hover:bg-[#047c5f] transition-all'
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* Map and Social */}
            <div className='w-1/2 md-lg:w-full'>
              <div className='h-[400px] bg-slate-200 rounded-md mb-6'>
                {/* This would be replaced with an actual map component */}
                <div className='w-full h-full flex items-center justify-center'>
                  <p className='text-slate-600'>Map will be displayed here</p>
                </div>
              </div>
              <div>
                <h3 className='text-xl font-bold text-slate-700 mb-4'>Connect With Us</h3>
                <ul className='flex gap-3'>
                  <li>
                    <a
                      className='w-[40px] h-[40px] hover:bg-[#059473] hover:text-white flex justify-center items-center bg-slate-100 rounded-full text-slate-600 transition-all'
                      href='#!'
                    >
                      <FaFacebookF />
                    </a>
                  </li>
                  <li>
                    <a
                      className='w-[40px] h-[40px] hover:bg-[#059473] hover:text-white flex justify-center items-center bg-slate-100 rounded-full text-slate-600 transition-all'
                      href='#!'
                    >
                      <FaTwitter />
                    </a>
                  </li>
                  <li>
                    <a
                      className='w-[40px] h-[40px] hover:bg-[#059473] hover:text-white flex justify-center items-center bg-slate-100 rounded-full text-slate-600 transition-all'
                      href='#!'
                    >
                      <FaLinkedin />
                    </a>
                  </li>
                  <li>
                    <a
                      className='w-[40px] h-[40px] hover:bg-[#059473] hover:text-white flex justify-center items-center bg-slate-100 rounded-full text-slate-600 transition-all'
                      href='#!'
                    >
                      <FaGithub />
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
