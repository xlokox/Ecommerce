import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaCalendarAlt, FaUser, FaComments, FaTags } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const blogPosts = {
  'future-of-ecommerce': {
    id: 'future-of-ecommerce',
    title: 'The Future of E-commerce: Trends to Watch',
    date: 'May 15, 2024',
    author: 'Admin',
    comments: 12,
    category: 'Technology',
    tags: ['E-commerce', 'Technology', 'Retail', 'Shopping'],
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=1000&auto=format&fit=crop',
    content: `
      <p class="mb-4">The e-commerce landscape is evolving at an unprecedented pace, transforming how businesses operate and consumers shop. As we move forward, several key trends are shaping the future of online retail.</p>

      <h3 class="text-xl font-bold mb-3 mt-6">1. Artificial Intelligence and Personalization</h3>
      <div class="flex flex-col md:flex-row gap-4 mb-6">
        <div class="md:w-2/3">
          <p class="mb-4">AI is revolutionizing e-commerce by enabling hyper-personalized shopping experiences. From product recommendations to customized search results, AI algorithms analyze user behavior to predict preferences and needs.</p>
          <p class="mb-4">Smart chatbots and virtual assistants are becoming increasingly sophisticated, providing 24/7 customer service and guiding shoppers through their purchasing journey.</p>
        </div>
        <div class="md:w-1/3">
          <img src="https://images.unsplash.com/photo-1535303311164-664fc9ec6532?q=80&w=1000&auto=format&fit=crop" alt="AI in Shopping" class="rounded-lg shadow-md w-full h-auto" />
        </div>
      </div>

      <h3 class="text-xl font-bold mb-3 mt-6">2. Augmented Reality Shopping</h3>
      <p class="mb-4">AR technology is bridging the gap between online and in-store shopping experiences. Customers can now visualize products in their own space before making a purchase decision.</p>
      <div class="mb-6">
        <img src="https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?q=80&w=1000&auto=format&fit=crop" alt="Augmented Reality Shopping" class="rounded-lg shadow-md w-full h-auto" />
      </div>
      <p class="mb-4">Furniture retailers, cosmetic brands, and fashion companies are leading the way in AR implementation, allowing customers to "try before they buy" virtually.</p>

      <h3 class="text-xl font-bold mb-3 mt-6">3. Voice Commerce</h3>
      <div class="flex flex-col md:flex-row gap-4 mb-6">
        <div class="md:w-1/3">
          <img src="https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=1000&auto=format&fit=crop" alt="Voice Shopping" class="rounded-lg shadow-md w-full h-auto" />
        </div>
        <div class="md:w-2/3">
          <p class="mb-4">With the growing popularity of smart speakers and voice assistants, voice commerce is gaining momentum. Consumers are increasingly comfortable making purchases through voice commands.</p>
          <p class="mb-4">Businesses are optimizing their platforms for voice search and creating voice-friendly shopping experiences to stay ahead of this trend.</p>
        </div>
      </div>

      <h3 class="text-xl font-bold mb-3 mt-6">4. Sustainable E-commerce</h3>
      <p class="mb-4">Environmental consciousness is influencing consumer behavior, with more shoppers seeking eco-friendly products and sustainable practices.</p>
      <p class="mb-4">E-commerce businesses are responding by adopting green packaging, carbon-neutral shipping options, and transparent supply chains.</p>

      <h3 class="text-xl font-bold mb-3 mt-6">5. Social Commerce Integration</h3>
      <div class="mb-6">
        <img src="https://images.unsplash.com/photo-1516251193007-45ef944ab0c6?q=80&w=1000&auto=format&fit=crop" alt="Social Commerce" class="rounded-lg shadow-md w-full h-auto" />
      </div>
      <p class="mb-4">The line between social media and e-commerce continues to blur. Platforms like Instagram, Facebook, and TikTok are enhancing their shopping features, allowing users to discover and purchase products without leaving the app.</p>
      <p class="mb-4">Live shopping events and influencer collaborations are becoming powerful sales channels for online retailers.</p>

      <h3 class="text-xl font-bold mb-3 mt-6">Conclusion</h3>
      <p class="mb-4">As technology advances and consumer expectations evolve, e-commerce will continue to transform. Businesses that stay ahead of these trends and adapt their strategies accordingly will thrive in the competitive online marketplace.</p>
      <p class="mb-4">The future of e-commerce is not just about selling products online—it's about creating immersive, personalized, and convenient shopping experiences that meet the changing needs of digital consumers.</p>
    `,
  },
  'electronics-for-home': {
    id: 'electronics-for-home',
    title: 'How to Choose the Perfect Electronics for Your Home',
    date: 'May 10, 2024',
    author: 'Admin',
    comments: 8,
    category: 'Technology',
    tags: ['Electronics', 'Smart Home', 'Technology', 'Gadgets'],
    image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=1000&auto=format&fit=crop',
    content: `<p>Content coming soon...</p>`,
  },
  'must-have-gadgets': {
    id: 'must-have-gadgets',
    title: 'Top 10 Must-Have Gadgets for 2024',
    date: 'May 5, 2024',
    author: 'Admin',
    comments: 15,
    category: 'Technology',
    tags: ['Gadgets', 'Technology', 'Innovation'],
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000&auto=format&fit=crop',
    content: `
      <p class="mb-4">In the rapidly evolving world of technology, staying up-to-date with the latest gadgets can be challenging. Here's our curated list of the top 10 must-have gadgets that are making waves in 2024.</p>

      <h3 class="text-xl font-bold mb-3 mt-6">1. Smart AR Glasses</h3>
      <div class="flex flex-col md:flex-row gap-4 mb-6">
        <div class="md:w-2/3">
          <p class="mb-4">Augmented reality glasses have finally reached a point where they're both functional and stylish. These lightweight glasses overlay digital information onto the real world, making them perfect for navigation, gaming, and productivity.</p>
          <p class="mb-4">The latest models feature improved battery life, sharper displays, and more intuitive controls, making them practical for everyday use.</p>
        </div>
        <div class="md:w-1/3">
          <img src="https://images.unsplash.com/photo-1626307416562-ee839676f5fc?q=80&w=1000&auto=format&fit=crop" alt="Smart AR Glasses" class="rounded-lg shadow-md w-full h-auto" />
        </div>
      </div>

      <h3 class="text-xl font-bold mb-3 mt-6">2. Foldable Smartphones</h3>
      <p class="mb-4">Foldable smartphones have matured significantly, with more durable screens and innovative form factors. These devices transform from a standard smartphone into a tablet-sized screen, offering versatility for work and entertainment.</p>
      <div class="mb-6">
        <img src="https://images.unsplash.com/photo-1659945563334-17c73a3ee7a6?q=80&w=1000&auto=format&fit=crop" alt="Foldable Smartphone" class="rounded-lg shadow-md w-full h-auto" />
      </div>

      <h3 class="text-xl font-bold mb-3 mt-6">3. AI-Powered Home Assistants</h3>
      <div class="flex flex-col md:flex-row gap-4 mb-6">
        <div class="md:w-1/3">
          <img src="https://images.unsplash.com/photo-1589492477829-5e65395b66cc?q=80&w=1000&auto=format&fit=crop" alt="AI Home Assistant" class="rounded-lg shadow-md w-full h-auto" />
        </div>
        <div class="md:w-2/3">
          <p class="mb-4">The latest generation of home assistants goes beyond simple voice commands. These devices now use advanced AI to learn your preferences, anticipate your needs, and control your entire smart home ecosystem seamlessly.</p>
          <p class="mb-4">With improved natural language processing, they can handle complex conversations and perform multiple tasks without requiring specific command phrases.</p>
        </div>
      </div>

      <h3 class="text-xl font-bold mb-3 mt-6">4. Portable Power Stations</h3>
      <p class="mb-4">As our reliance on electronic devices grows, so does our need for reliable power sources. Modern portable power stations offer massive capacity in compact packages, with fast charging capabilities and multiple output options.</p>
      <p class="mb-4">Whether you're camping, experiencing a power outage, or just need extra juice for your devices, these power stations are essential for staying connected.</p>

      <h3 class="text-xl font-bold mb-3 mt-6">5. Smart Fitness Mirrors</h3>
      <div class="mb-6">
        <img src="https://images.unsplash.com/photo-1576678927484-cc907957088c?q=80&w=1000&auto=format&fit=crop" alt="Smart Fitness Mirror" class="rounded-lg shadow-md w-full h-auto" />
      </div>
      <p class="mb-4">Transform your home workout experience with smart fitness mirrors. These interactive displays provide personalized training sessions, real-time form corrections, and performance tracking.</p>
      <p class="mb-4">When not in use for exercise, they function as elegant mirrors, making them a practical addition to any home.</p>

      <h3 class="text-xl font-bold mb-3 mt-6">6. Noise-Cancelling Earbuds</h3>
      <p class="mb-4">The latest noise-cancelling earbuds offer incredible sound quality and active noise cancellation in an ultra-compact form. With improved battery life, water resistance, and smart features like automatic pausing when removed, they're perfect for both work and leisure.</p>

      <h3 class="text-xl font-bold mb-3 mt-6">7. Smart Home Security Systems</h3>
      <div class="flex flex-col md:flex-row gap-4 mb-6">
        <div class="md:w-2/3">
          <p class="mb-4">Modern home security systems combine high-resolution cameras, smart sensors, and AI-powered analytics to provide comprehensive protection. These systems can distinguish between family members, pets, and potential intruders, reducing false alarms.</p>
          <p class="mb-4">Integration with other smart home devices allows for automated responses, such as turning on lights when motion is detected.</p>
        </div>
        <div class="md:w-1/3">
          <img src="https://images.unsplash.com/photo-1558002038-1055e2e28ed1?q=80&w=1000&auto=format&fit=crop" alt="Smart Home Security" class="rounded-lg shadow-md w-full h-auto" />
        </div>
      </div>

      <h3 class="text-xl font-bold mb-3 mt-6">8. E-Ink Tablets</h3>
      <p class="mb-4">E-ink tablets combine the paper-like reading experience of e-readers with the functionality of a tablet. These devices are perfect for reading, note-taking, and sketching, with minimal eye strain and exceptional battery life.</p>
      <p class="mb-4">The latest models feature faster refresh rates and color e-ink technology, expanding their usefulness beyond just reading.</p>

      <h3 class="text-xl font-bold mb-3 mt-6">9. Robot Vacuum and Mop Combos</h3>
      <div class="mb-6">
        <img src="https://images.unsplash.com/photo-1567689265664-1c48de61d93b?q=80&w=1000&auto=format&fit=crop" alt="Robot Vacuum and Mop" class="rounded-lg shadow-md w-full h-auto" />
      </div>
      <p class="mb-4">Take home automation to the next level with advanced robot vacuums that can both vacuum and mop your floors. These intelligent cleaning assistants use advanced mapping technology to navigate your home efficiently.</p>
      <p class="mb-4">With app control, voice assistant integration, and self-emptying capabilities, they make maintaining clean floors effortless.</p>

      <h3 class="text-xl font-bold mb-3 mt-6">10. Portable Monitors</h3>
      <p class="mb-4">Enhance your productivity on the go with ultra-thin portable monitors. These lightweight displays connect to your laptop, tablet, or smartphone, instantly providing you with a dual-screen setup wherever you are.</p>
      <p class="mb-4">With improved resolution, brightness, and connectivity options, they're essential tools for remote workers and digital nomads.</p>

      <h3 class="text-xl font-bold mb-3 mt-6">Conclusion</h3>
      <p class="mb-4">These innovative gadgets represent the cutting edge of consumer technology in 2024. While some focus on enhancing productivity, others aim to improve our health, security, or entertainment experiences.</p>
      <p class="mb-4">As technology continues to evolve at a rapid pace, these gadgets offer a glimpse into how our digital and physical worlds are becoming increasingly integrated, making our lives more convenient, connected, and enjoyable.</p>
    `,
  },
  'sustainable-shopping': {
    id: 'sustainable-shopping',
    title: 'Sustainable Shopping: Eco-Friendly Products Guide',
    date: 'April 28, 2024',
    author: 'Admin',
    comments: 6,
    category: 'Lifestyle',
    tags: ['Eco-Friendly', 'Sustainability', 'Shopping'],
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1000&auto=format&fit=crop',
    content: `<p>Content coming soon...</p>`,
  },
};

const BlogDetails = () => {
  const { id } = useParams();
  const post = blogPosts[id];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Article Not Found</h2>
          <p className="mb-6">The article you're looking for doesn't exist or has been removed.</p>
          <Link to="/blog" className="bg-emerald-600 text-white px-6 py-2 rounded-md hover:bg-emerald-700 transition">
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
        {/* Hero Image */}
        <div className="mb-6">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-auto rounded-lg shadow-md"
          />
        </div>

        {/* Title and Meta */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">{post.title}</h1>

          <div className="flex flex-wrap items-center text-gray-600 gap-4 mb-4">
            <div className="flex items-center">
              <FaCalendarAlt className="mr-2" />
              <span>{post.date}</span>
            </div>
            <div className="flex items-center">
              <FaUser className="mr-2" />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center">
              <FaComments className="mr-2" />
              <span>{post.comments} Comments</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag, index) => (
              <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: post.content }}></div>

        {/* Author Bio */}
        <div className="mt-12 bg-gray-50 p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden">
              <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1000&auto=format&fit=crop" alt="Author" className="w-full h-full object-cover" />
            </div>
            <div>
              <h3 className="text-lg font-bold">{post.author}</h3>
              <p className="text-gray-600">Content Creator & E-commerce Specialist</p>
            </div>
          </div>
          <p className="mt-4 text-gray-700">
            Our team of experts brings you the latest insights and trends in e-commerce, technology, and digital marketing.
            With years of experience in the industry, we provide valuable information to help businesses and consumers navigate the digital landscape.
          </p>
        </div>

        {/* Related Posts */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.values(blogPosts)
              .filter(relatedPost => relatedPost.id !== post.id)
              .slice(0, 2)
              .map(relatedPost => (
                <div key={relatedPost.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <Link to={`/blog/${relatedPost.id}`}>
                    <img
                      src={relatedPost.image}
                      alt={relatedPost.title}
                      className="w-full h-48 object-cover"
                    />
                  </Link>
                  <div className="p-4">
                    <Link to={`/blog/${relatedPost.id}`}>
                      <h3 className="text-lg font-bold mb-2 hover:text-emerald-600 transition">{relatedPost.title}</h3>
                    </Link>
                    <div className="flex items-center text-gray-600 text-sm">
                      <FaCalendarAlt className="mr-1" />
                      <span>{relatedPost.date}</span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Back to Blog */}
        <div className="mt-12 text-center">
          <Link
            to="/blog"
            className="bg-emerald-600 text-white px-6 py-2 rounded-md hover:bg-emerald-700 transition"
          >
            Back to Blog
          </Link>
        </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BlogDetails;
