import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import { IoIosArrowForward } from "react-icons/io";
import { FaUser, FaCalendarAlt, FaComment } from "react-icons/fa";

const Blog = () => {
  // Sample blog posts data
  const blogPosts = [
    {
      id: "future-of-ecommerce",
      title: "The Future of E-commerce: Trends to Watch",
      image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=1000&auto=format&fit=crop",
      date: "May 15, 2024",
      author: "Admin",
      comments: 12,
      excerpt: "Discover the latest trends shaping the future of online shopping and e-commerce platforms."
    },
    {
      id: "electronics-for-home",
      title: "How to Choose the Perfect Electronics for Your Home",
      image: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=1000&auto=format&fit=crop",
      date: "May 10, 2024",
      author: "Admin",
      comments: 8,
      excerpt: "A comprehensive guide to selecting the best electronic devices for your home needs."
    },
    {
      id: "must-have-gadgets",
      title: "Top 10 Must-Have Gadgets for 2024",
      image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000&auto=format&fit=crop",
      date: "May 5, 2024",
      author: "Admin",
      comments: 15,
      excerpt: "Explore the most innovative and essential gadgets that are making waves this year."
    },
    {
      id: "sustainable-shopping",
      title: "Sustainable Shopping: Eco-Friendly Products Guide",
      image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1000&auto=format&fit=crop",
      date: "April 28, 2024",
      author: "Admin",
      comments: 6,
      excerpt: "Learn how to make environmentally conscious choices when shopping online."
    },
    {
      id: "smart-home-technology",
      title: "The Rise of Smart Home Technology",
      image: "https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?q=80&w=1000&auto=format&fit=crop",
      date: "April 20, 2024",
      author: "Admin",
      comments: 10,
      excerpt: "How smart home devices are transforming the way we live and interact with our living spaces."
    },
    {
      id: "budget-shopping-tips",
      title: "Budget-Friendly Shopping Tips for Tech Enthusiasts",
      image: "https://images.unsplash.com/photo-1607082349566-187342175e2f?q=80&w=1000&auto=format&fit=crop",
      date: "April 15, 2024",
      author: "Admin",
      comments: 4,
      excerpt: "Strategies to get the best deals on technology products without breaking the bank."
    }
  ];

  // Categories for sidebar
  const categories = [
    { name: "Technology", count: 15 },
    { name: "Fashion", count: 8 },
    { name: "Food", count: 12 },
    { name: "Travel", count: 10 },
    { name: "Lifestyle", count: 14 }
  ];

  // Recent posts for sidebar
  const recentPosts = blogPosts.slice(0, 3);

  return (
    <div className="w-full">
      <Header />

      {/* Banner Section */}
      <section className='bg-[url("https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1000&auto=format&fit=crop")] h-[220px] mt-6 bg-cover bg-no-repeat relative bg-center'>
        <div className='absolute left-0 top-0 w-full h-full bg-[#2422228a]'>
          <div className='w-[85%] md:w-[80%] sm:w-[90%] lg:w-[90%] h-full mx-auto'>
            <div className='flex flex-col justify-center gap-1 items-center h-full w-full text-white'>
              <h2 className='text-3xl font-bold'>Our Blog</h2>
              <div className='flex justify-center items-center gap-2 text-2xl w-full'>
                <Link to='/'>Home</Link>
                <span className='pt-1'>
                  <IoIosArrowForward />
                </span>
                <span>Blog</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Content */}
      <section className='py-16'>
        <div className='w-[85%] md:w-[80%] sm:w-[90%] lg:w-[90%] mx-auto'>
          <div className='flex flex-wrap'>
            {/* Main Content */}
            <div className='w-8/12 md-lg:w-full pr-8 md-lg:pr-0'>
              <div className='grid grid-cols-2 md:grid-cols-1 gap-6'>
                {blogPosts.map(post => (
                  <div key={post.id} className='bg-white rounded-md overflow-hidden shadow-sm hover:shadow-md transition-all duration-300'>
                    <div className='overflow-hidden h-[240px]'>
                      <img
                        className='w-full h-full object-cover transition-all duration-500 hover:scale-110'
                        src={post.image}
                        alt={post.title}
                      />
                    </div>
                    <div className='p-5'>
                      <div className='flex justify-start items-center gap-3 text-sm text-slate-500 mb-3'>
                        <span className='flex items-center gap-1'>
                          <FaCalendarAlt />
                          {post.date}
                        </span>
                        <span className='flex items-center gap-1'>
                          <FaUser />
                          {post.author}
                        </span>
                        <span className='flex items-center gap-1'>
                          <FaComment />
                          {post.comments}
                        </span>
                      </div>
                      <h2 className='text-xl font-bold text-slate-700 mb-2'>{post.title}</h2>
                      <p className='text-slate-600 mb-4'>{post.excerpt}</p>
                      <Link
                        to={`/blog/${post.id}`}
                        className='px-4 py-2 bg-[#059473] text-white rounded-md inline-block hover:bg-[#047c5f] transition-all'
                      >
                        Read More
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className='w-4/12 md-lg:w-full md-lg:mt-10'>
              {/* Search */}
              <div className='bg-white p-5 rounded-md shadow-sm mb-8'>
                <h3 className='text-xl font-bold text-slate-700 mb-4 pb-2 border-b'>Search</h3>
                <div className='flex border h-[45px] items-center relative'>
                  <input
                    className='w-full relative bg-transparent text-slate-500 outline-0 px-3 h-full'
                    type="text"
                    placeholder='Search...'
                  />
                  <button
                    className='bg-[#059473] right-0 absolute px-4 h-full font-semibold text-white'
                  >
                    Search
                  </button>
                </div>
              </div>

              {/* Categories */}
              <div className='bg-white p-5 rounded-md shadow-sm mb-8'>
                <h3 className='text-xl font-bold text-slate-700 mb-4 pb-2 border-b'>Categories</h3>
                <ul>
                  {categories.map((category, index) => (
                    <li key={index} className='mb-2 pb-2 border-b border-dashed last:border-0'>
                      <Link
                        to={`/blog/category/${category.name.toLowerCase()}`}
                        className='flex justify-between items-center text-slate-600 hover:text-[#059473] transition-all'
                      >
                        <span>{category.name}</span>
                        <span>({category.count})</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recent Posts */}
              <div className='bg-white p-5 rounded-md shadow-sm mb-8'>
                <h3 className='text-xl font-bold text-slate-700 mb-4 pb-2 border-b'>Recent Posts</h3>
                <div className='flex flex-col gap-4'>
                  {recentPosts.map(post => (
                    <div key={post.id} className='flex gap-3'>
                      <div className='w-1/3'>
                        <img
                          className='w-full h-[70px] object-cover rounded-md'
                          src={post.image}
                          alt={post.title}
                        />
                      </div>
                      <div className='w-2/3'>
                        <h4 className='text-sm font-semibold text-slate-700 mb-1 line-clamp-2'>{post.title}</h4>
                        <span className='text-xs text-slate-500'>{post.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div className='bg-white p-5 rounded-md shadow-sm'>
                <h3 className='text-xl font-bold text-slate-700 mb-4 pb-2 border-b'>Tags</h3>
                <div className='flex flex-wrap gap-2'>
                  {['Technology', 'Fashion', 'Food', 'Travel', 'Lifestyle', 'Electronics', 'Gadgets', 'Home', 'Office'].map((tag, index) => (
                    <Link
                      key={index}
                      to={`/blog/tag/${tag.toLowerCase()}`}
                      className='px-3 py-1 bg-slate-100 text-slate-600 rounded-md text-sm hover:bg-[#059473] hover:text-white transition-all'
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Blog;
