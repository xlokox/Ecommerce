import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { get_products } from "../store/reducers/homeReducer";
import { useRecentlyViewed } from "../context/RecentlyViewedContext";

import Header from "../components/Header";
import Banner from "../components/Banner";
import Categorys from "../components/Categorys";
import FeatureProducts from "../components/products/FeatureProducts";
import Products from "../components/products/Products";
import Footer from "../components/Footer";

const Home = () => {
  const dispatch = useDispatch();
  const { recentlyViewed } = useRecentlyViewed();
  const {
    products,
    latest_product,
    topRated_product,
    discount_product
  } = useSelector((state) => state.home);

  useEffect(() => {
    dispatch(get_products());
  }, [dispatch]);

  // Format recently viewed products to match the expected 2D array structure
  const formatProductsForCarousel = (products) => {
    const productArray = [];
    let i = 0;
    while (i < products.length) {
      let temp = [];
      let j = i;
      while (j < i + 3 && j < products.length) {
        temp.push(products[j]);
        j++;
      }
      productArray.push([...temp]);
      i = j;
    }
    return productArray;
  };

  const formattedRecentlyViewed = recentlyViewed && recentlyViewed.length > 0
    ? formatProductsForCarousel(recentlyViewed)
    : [];

  // Debug logging
  console.log('Recently viewed raw:', recentlyViewed);
  console.log('Recently viewed formatted:', formattedRecentlyViewed);

  return (
    <div className="w-full">
      <Header />
      <Banner />
      <Categorys />

      <div className="py-[45px]">
        {products && products.length > 0 && (
          <FeatureProducts products={products} />
        )}
      </div>

      <div className="py-10">
        <div className="w-[85%] flex flex-wrap mx-auto">
          <div className="grid w-full grid-cols-3 md-lg:grid-cols-2 md:grid-cols-1 gap-7">
            <div className="overflow-hidden">
              {formattedRecentlyViewed && formattedRecentlyViewed.length > 0 ? (
                <Products title="Recently Viewed" products={formattedRecentlyViewed} />
              ) : latest_product && latest_product.length > 0 && (
                <Products title="Latest Product" products={latest_product} />
              )}
            </div>
            <div className="overflow-hidden">
              {topRated_product && topRated_product.length > 0 && (
                <Products title="Top Rated Product" products={topRated_product} />
              )}
            </div>
            <div className="overflow-hidden">
              {discount_product && discount_product.length > 0 && (
                <Products title="Discount Product" products={discount_product} />
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Home;
