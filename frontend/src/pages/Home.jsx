import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
// מחליפים get_products ב-get_top_category_products
import { get_top_category_products } from "../store/reducers/homeReducer";

import Header from "../components/Header";
import Banner from "../components/Banner";
import Categorys from "../components/Categorys";
import FeatureProducts from "../components/products/FeatureProducts";
import Products from "../components/products/Products";
import Footer from "../components/Footer";

const Home = () => {
  const dispatch = useDispatch();
  // שולפים מהסטור גם אם תרצה להציג Latest/TopRated/Discount
  const { 
    topCategoryProducts,
    latest_product,
    topRated_product,
    discount_product 
  } = useSelector((state) => state.home);

  useEffect(() => {
    // מפעילים את ה-Thunk שמושך מוצרים מ"Top Category"
    dispatch(get_top_category_products());
  }, [dispatch]);

  return (
    <div className="w-full">
      <Header />
      <Banner />
      <Categorys />

      <div className="py-[45px]">
        {/* כאן נציג את מוצרי ה-Top Category ב-FeatureProducts */}
        <FeatureProducts products={topCategoryProducts} />
      </div>

      {/* אם תרצה להשאיר גם Latest/TopRated/Discount ממקור אחר */}
      <div className="py-10">
        <div className="w-[85%] flex flex-wrap mx-auto">
          <div className="grid w-full grid-cols-3 md-lg:grid-cols-2 md:grid-cols-1 gap-7">
            <div className="overflow-hidden">
              <Products title="Latest Product" products={latest_product} />
            </div>
            <div className="overflow-hidden">
              <Products title="Top Rated Product" products={topRated_product} />
            </div>
            <div className="overflow-hidden">
              <Products title="Discount Product" products={discount_product} />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Home;
