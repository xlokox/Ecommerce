import mongoose from 'mongoose';
import categoryModel from '../models/categoryModel.js';

// New categories to add
const newCategories = [
  {
    name: "Smartphones",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3",
    slug: "smartphones"
  },
  {
    name: "Laptops",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=2942&auto=format&fit=crop&ixlib=rb-4.0.3",
    slug: "laptops"
  },
  {
    name: "Audio",
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=2865&auto=format&fit=crop&ixlib=rb-4.0.3",
    slug: "audio"
  },
  {
    name: "Wearables",
    image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=2872&auto=format&fit=crop&ixlib=rb-4.0.3",
    slug: "wearables"
  },
  {
    name: "Men's Fashion",
    image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3",
    slug: "mens-fashion"
  },
  {
    name: "Women's Fashion",
    image: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3",
    slug: "womens-fashion"
  },
  {
    name: "Footwear",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=2912&auto=format&fit=crop&ixlib=rb-4.0.3",
    slug: "footwear"
  },
  {
    name: "Kitchen Appliances",
    image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3",
    slug: "kitchen-appliances"
  },
  {
    name: "Home Decor",
    image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3",
    slug: "home-decor"
  },
  {
    name: "Furniture",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3",
    slug: "furniture"
  },
  {
    name: "Fiction",
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3",
    slug: "fiction"
  },
  {
    name: "Non-Fiction",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=2798&auto=format&fit=crop&ixlib=rb-4.0.3",
    slug: "non-fiction"
  },
  {
    name: "Children's Books",
    image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3",
    slug: "childrens-books"
  },
  {
    name: "Board Games",
    image: "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?q=80&w=2831&auto=format&fit=crop&ixlib=rb-4.0.3",
    slug: "board-games"
  },
  {
    name: "Outdoor Toys",
    image: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3",
    slug: "outdoor-toys"
  },
  {
    name: "Beauty",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=2880&auto=format&fit=crop&ixlib=rb-4.0.3",
    slug: "beauty"
  },
  {
    name: "Health",
    image: "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3",
    slug: "health"
  },
  {
    name: "Sports",
    image: "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3",
    slug: "sports"
  },
  {
    name: "Outdoor Gear",
    image: "https://images.unsplash.com/photo-1445307806294-bff7f67ff225?q=80&w=2874&auto=format&fit=crop&ixlib=rb-4.0.3",
    slug: "outdoor-gear"
  },
  {
    name: "Automotive",
    image: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3",
    slug: "automotive"
  }
];

// Connect to MongoDB
const dbConnect = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/ecommerce');
    console.log('✅ Database connected successfully');
    
    // Add categories
    for (const category of newCategories) {
      try {
        // Check if category already exists
        const existingCategory = await categoryModel.findOne({ slug: category.slug });
        if (existingCategory) {
          console.log(`Category ${category.name} already exists, skipping...`);
          continue;
        }
        
        // Create new category
        await categoryModel.create(category);
        console.log(`✅ Added category: ${category.name}`);
      } catch (error) {
        console.error(`❌ Error adding category ${category.name}:`, error.message);
      }
    }
    
    console.log('✅ Categories added successfully');
    
    // Close connection
    await mongoose.connection.close();
    console.log('✅ Database connection closed');
    
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
  }
};

// Run the function
dbConnect();
