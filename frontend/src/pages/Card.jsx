import React, { useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link, useNavigate } from 'react-router-dom';
import { IoIosArrowForward } from "react-icons/io";
import { useDispatch, useSelector } from 'react-redux';
import {
  get_card_products,
  delete_card_product,
  messageClear,
  quantity_inc,
  quantity_dec
} from '../store/reducers/cardReducer';
import toast from 'react-hot-toast';

const Card = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector(state => state.auth);
  const {
    card_products,
    successMessage,
    price,
    buy_product_item,
    shipping_fee,
    outofstock_products
  } = useSelector(state => state.card);

  const navigate = useNavigate();

  useEffect(() => {
    if (userInfo && userInfo.id) {
      console.log('Fetching cart products for user:', userInfo.id);
      dispatch(get_card_products(userInfo.id));
    }
  }, [dispatch, userInfo]);

  const redirect = () => {
    navigate('/shipping', {
      state: {
        products: card_products,
        price: price,
        shipping_fee: shipping_fee,
        items: buy_product_item
      }
    });
  };

  // Log cart products when they change
  useEffect(() => {
    console.log('Cart products:', card_products);
    console.log('Out of stock products:', outofstock_products);

    // Log detailed structure of the first product if available
    if (card_products.length > 0) {
      console.log('First product structure:', JSON.stringify(card_products[0], null, 2));
      if (card_products[0].products && card_products[0].products.length > 0) {
        console.log('First nested product:', JSON.stringify(card_products[0].products[0], null, 2));
      }
    }
  }, [card_products, outofstock_products]);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
      if (userInfo && userInfo.id) {
        dispatch(get_card_products(userInfo.id));
      }
    }
  }, [successMessage, dispatch, userInfo]);

  const inc = (quantity, stock, card_id, parent_id) => {
    const temp = quantity + 1;
    if (temp <= stock) {
      // Use the parent ID for the API call
      dispatch(quantity_inc(parent_id || card_id));
    }
  };

  const dec = (quantity, card_id, parent_id) => {
    const temp = quantity - 1;
    if (temp !== 0) {
      // Use the parent ID for the API call
      dispatch(quantity_dec(parent_id || card_id));
    }
  };

  return (
    <div>
      <Header />
      <section className='bg-[url("http://localhost:3000/images/banner/shop.png")] h-[220px] mt-6 bg-cover bg-no-repeat relative bg-left'>
        <div className='absolute left-0 top-0 w-full h-full bg-[#2422228a]'>
          <div className='w-[85%] md:w-[80%] sm:w-[90%] lg:w-[90%] h-full mx-auto'>
            <div className='flex flex-col justify-center gap-1 items-center h-full w-full text-white'>
              <h2 className='text-3xl font-bold'>Card Page</h2>
              <div className='flex justify-center items-center gap-2 text-2xl w-full'>
                <Link to='/'>Home</Link>
                <span className='pt-1'>
                  <IoIosArrowForward />
                </span>
                <span>Card</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className='bg-[#eeeeee]'>
        <div className='w-[85%] lg:w-[90%] md:w-[90%] sm:w-[90%] mx-auto py-16'>
          {(card_products.length > 0 || outofstock_products.length > 0) ? (
            <div className='flex flex-wrap'>
              {/* Left side */}
              <div className='w-[67%] md-lg:w-full'>
                <div className='pr-3 md-lg:pr-0'>
                  <div className='flex flex-col gap-3'>
                    {/* Stock Products */}
                    <div className='bg-white p-4'>
                      <h2 className='text-md text-green-500 font-semibold'>
                        Stock Products {card_products.length}
                      </h2>
                    </div>

                    {/* Mapping Stock Products */}
                    {card_products.map((p, i) => (
                      <div key={i} className='flex bg-white p-4 flex-col gap-2'>
                        <div className='flex justify-start items-center'>
                          <h2 className='text-md text-slate-600 font-bold'>
                            {p.shopName}
                          </h2>
                        </div>
                        {p.products && p.products.map((pt, idx) => (
                          <div key={idx} className='w-full flex flex-wrap'>
                            <div className='flex sm:w-full gap-2 w-7/12'>
                              <div className='flex gap-2 justify-start items-center'>
                                {/* Try different possible image paths */}
                                {pt.productInfo && pt.productInfo.images && pt.productInfo.images[0] ? (
                                  <img
                                    className='w-[80px] h-[80px]'
                                    src={pt.productInfo.images[0]}
                                    alt="Product"
                                  />
                                ) : pt.products && pt.products[0] && pt.products[0].images && pt.products[0].images[0] ? (
                                  <img
                                    className='w-[80px] h-[80px]'
                                    src={pt.products[0].images[0]}
                                    alt="Product"
                                  />
                                ) : pt.images && pt.images[0] ? (
                                  <img
                                    className='w-[80px] h-[80px]'
                                    src={pt.images[0]}
                                    alt="Product"
                                  />
                                ) : (
                                  <div className='w-[80px] h-[80px] bg-gray-200 flex items-center justify-center'>
                                    <span>No Image</span>
                                  </div>
                                )}
                                <div className='pr-4 text-slate-600'>
                                  <h2 className='text-md font-semibold'>
                                    {pt.productInfo && pt.productInfo.name ? pt.productInfo.name :
                                     pt.products && pt.products[0] && pt.products[0].name ? pt.products[0].name :
                                     pt.name ? pt.name : 'Product'}
                                  </h2>
                                  <span className='text-sm'>
                                    Brand: {pt.productInfo && pt.productInfo.brand ? pt.productInfo.brand :
                                           pt.products && pt.products[0] && pt.products[0].brand ? pt.products[0].brand :
                                           pt.brand ? pt.brand : 'Unknown'}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className='flex justify-between w-5/12 sm:w-full sm:mt-3'>
                              <div className='pl-4 sm:pl-0'>
                                {pt.productInfo && pt.productInfo.price ? (
                                  <>
                                    <h2 className='text-lg text-orange-500'>
                                      $
                                      {pt.productInfo.price -
                                        Math.floor(
                                          (pt.productInfo.price *
                                            (pt.productInfo.discount || 0)) /
                                            100
                                        )}
                                    </h2>
                                    <p className='line-through'>
                                      ${pt.productInfo.price}
                                    </p>
                                    <p>-{pt.productInfo.discount || 0}%</p>
                                  </>
                                ) : pt.products && pt.products[0] && pt.products[0].price ? (
                                  <>
                                    <h2 className='text-lg text-orange-500'>
                                      $
                                      {pt.products[0].price -
                                        Math.floor(
                                          (pt.products[0].price *
                                            (pt.products[0].discount || 0)) /
                                            100
                                        )}
                                    </h2>
                                    <p className='line-through'>
                                      ${pt.products[0].price}
                                    </p>
                                    <p>-{pt.products[0].discount || 0}%</p>
                                  </>
                                ) : pt.price ? (
                                  <>
                                    <h2 className='text-lg text-orange-500'>
                                      $
                                      {pt.price -
                                        Math.floor(
                                          (pt.price *
                                            (pt.discount || 0)) /
                                            100
                                        )}
                                    </h2>
                                    <p className='line-through'>
                                      ${pt.price}
                                    </p>
                                    <p>-{pt.discount || 0}%</p>
                                  </>
                                ) : (
                                  <h2 className='text-lg text-orange-500'>Price not available</h2>
                                )}
                              </div>
                              <div className='flex gap-2 flex-col'>
                                <div className='flex bg-slate-200 h-[30px] justify-center items-center text-xl'>
                                  <div
                                    onClick={() => dec(pt.quantity, pt._id, p._id)}
                                    className='px-3 cursor-pointer'
                                  >
                                    -
                                  </div>
                                  <div className='px-3'>{pt.quantity}</div>
                                  <div
                                    onClick={() =>
                                      inc(pt.quantity, pt.productInfo ? pt.productInfo.stock : 0, pt._id, p._id)
                                    }
                                    className='px-3 cursor-pointer'
                                  >
                                    +
                                  </div>
                                </div>
                                <button
                                  onClick={() => {
                                    // The correct ID to delete is the parent's _id, not the nested product's _id
                                    console.log('Deleting product with ID:', p._id);
                                    console.log('Product details:', p);
                                    dispatch(delete_card_product(p._id));
                                  }}
                                  className='px-5 py-[3px] bg-red-500 text-white'
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}

                    {/* Out of Stock */}
                    {outofstock_products.length > 0 && (
                      <div className='flex flex-col gap-3'>
                        <div className='bg-white p-4'>
                          <h2 className='text-md text-red-500 font-semibold'>
                            Out of Stock {outofstock_products.length}
                          </h2>
                        </div>

                        <div className='bg-white p-4'>
                          {outofstock_products.map((p, i) => (
                            <div key={i} className='w-full flex flex-wrap'>
                              <div className='flex sm:w-full gap-2 w-7/12'>
                                <div className='flex gap-2 justify-start items-center'>
                                  {/* Try different possible image paths for out of stock products */}
                                  {p.productInfo && p.productInfo.images && p.productInfo.images[0] ? (
                                    <img
                                      className='w-[80px] h-[80px]'
                                      src={p.productInfo.images[0]}
                                      alt="Product"
                                    />
                                  ) : p.products && p.products[0] && p.products[0].images && p.products[0].images[0] ? (
                                    <img
                                      className='w-[80px] h-[80px]'
                                      src={p.products[0].images[0]}
                                      alt="Product"
                                    />
                                  ) : p.images && p.images[0] ? (
                                    <img
                                      className='w-[80px] h-[80px]'
                                      src={p.images[0]}
                                      alt="Product"
                                    />
                                  ) : (
                                    <div className='w-[80px] h-[80px] bg-gray-200 flex items-center justify-center'>
                                      <span>No Image</span>
                                    </div>
                                  )}
                                  <div className='pr-4 text-slate-600'>
                                    <h2 className='text-md font-semibold'>
                                      {p.productInfo && p.productInfo.name ? p.productInfo.name :
                                       p.products && p.products[0] && p.products[0].name ? p.products[0].name :
                                       p.name ? p.name : 'Product'}
                                    </h2>
                                    <span className='text-sm'>
                                      Brand: {p.productInfo && p.productInfo.brand ? p.productInfo.brand :
                                             p.products && p.products[0] && p.products[0].brand ? p.products[0].brand :
                                             p.brand ? p.brand : 'Unknown'}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className='flex justify-between w-5/12 sm:w-full sm:mt-3'>
                                <div className='pl-4 sm:pl-0'>
                                  {p.productInfo && p.productInfo.price ? (
                                    <>
                                      <h2 className='text-lg text-orange-500'>
                                        $
                                        {p.productInfo.price -
                                          Math.floor(
                                            (p.productInfo.price *
                                              (p.productInfo.discount || 0)) /
                                              100
                                          )}
                                      </h2>
                                      <p className='line-through'>
                                        ${p.productInfo.price}
                                      </p>
                                      <p>-{p.productInfo.discount || 0}%</p>
                                    </>
                                  ) : p.products && p.products[0] && p.products[0].price ? (
                                    <>
                                      <h2 className='text-lg text-orange-500'>
                                        $
                                        {p.products[0].price -
                                          Math.floor(
                                            (p.products[0].price *
                                              (p.products[0].discount || 0)) /
                                              100
                                          )}
                                      </h2>
                                      <p className='line-through'>
                                        ${p.products[0].price}
                                      </p>
                                      <p>-{p.products[0].discount || 0}%</p>
                                    </>
                                  ) : p.price ? (
                                    <>
                                      <h2 className='text-lg text-orange-500'>
                                        $
                                        {p.price -
                                          Math.floor(
                                            (p.price *
                                              (p.discount || 0)) /
                                              100
                                          )}
                                      </h2>
                                      <p className='line-through'>
                                        ${p.price}
                                      </p>
                                      <p>-{p.discount || 0}%</p>
                                    </>
                                  ) : (
                                    <h2 className='text-lg text-orange-500'>Price not available</h2>
                                  )}
                                </div>
                                <div className='flex gap-2 flex-col'>
                                  <div className='flex bg-slate-200 h-[30px] justify-center items-center text-xl'>
                                    <div
                                      onClick={() => dec(p.quantity, p._id, p._id)}
                                      className='px-3 cursor-pointer'
                                    >
                                      -
                                    </div>
                                    <div className='px-3'>{p.quantity}</div>
                                    <div className='px-3 cursor-pointer'>+</div>
                                  </div>
                                  <button
                                    onClick={() => {
                                      // For out-of-stock products, we use the parent's _id directly
                                      console.log('Deleting out-of-stock product with ID:', p._id);
                                      console.log('Out-of-stock product details:', p);
                                      dispatch(delete_card_product(p._id));
                                    }}
                                    className='px-5 py-[3px] bg-red-500 text-white'
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right side */}
              <div className='w-[33%] md-lg:w-full'>
                <div className='pl-3 md-lg:pl-0 md-lg:mt-5'>
                  {card_products.length > 0 && (
                    <div className='bg-white p-3 text-slate-600 flex flex-col gap-3'>
                      <h2 className='text-xl font-bold'>Order Summary</h2>
                      <div className='flex justify-between items-center'>
                        <span>{buy_product_item} Items</span>
                        <span>${price}</span>
                      </div>
                      <div className='flex justify-between items-center'>
                        <span>Shipping Fee</span>
                        <span>${shipping_fee}</span>
                      </div>
                      <div className='flex gap-2'>
                        <input
                          className='w-full px-3 py-2 border border-slate-200 outline-0 focus:border-green-500 rounded-sm'
                          type='text'
                          placeholder='Input Vauchar Coupon'
                        />
                        <button className='px-5 py-[1px] bg-[#059473] text-white rounded-sm uppercase text-sm'>
                          Apply
                        </button>
                      </div>

                      <div className='flex justify-between items-center'>
                        <span>Total</span>
                        <span className='text-lg text-[#059473]'>
                          ${price + shipping_fee}
                        </span>
                      </div>
                      <button
                        onClick={redirect}
                        className='px-5 py-[6px] rounded-sm hover:shadow-red-500/50 hover:shadow-lg bg-red-500 text-sm text-white uppercase'
                      >
                        Process to Checkout ({buy_product_item})
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div>
              <Link className='px-4 py-1 bg-indigo-500 text-white' to='/shops'>
                Shop Now
              </Link>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Card;
