import { Layout } from "../../components";
import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { InfinitySpin } from "react-loader-spinner";

import { useState } from "react";
import { DeleteForever } from "@mui/icons-material";

export default function Cart() {
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const deleteCart = useMutation({
    mutationKey: ["delete"],
    mutationFn: async (id) => {
      try {
        const email = localStorage.getItem("email");
        const url = `${import.meta.env.VITE_SERVER_URL}/api/auth/cart-delete`;

        const response = await axios.post(url, {
          id: id,
          email: email,
        });
        return response.data;
      } catch (error) {
        throw new Error(
          error.response.data.message || "Failed to delete item from cart",
        );
      }
    },
    onSuccess: () => {
      getCart.refetch();
    },
    onError: (error) => {
      console.error(error.message);
    },
  });

  const getCart = useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const email = localStorage.getItem("email");
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/auth/cart`,
        { email },
      );
      return response.data;
    },
  });

  const handleCheckout = async () => {
    try {
      setCheckoutLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/auth/payment`,
        {
          images: getCart.data.images,
          userEmail: localStorage.getItem("email"),
        },
      );
      window.location.href = response.data.url;
    } catch (error) {
      console.error("Error during checkout:", error);
      // Handle error
    } finally {
      setCheckoutLoading(false);
    }
  };

  const totalPrice = getCart.data ? getCart.data.images.length * 60 : 0;

  return (
    <Layout>
      <section className="py-24 relative mt-10">
        {getCart.isLoading && <InfinitySpin color="#587cdd" />}{" "}
        {getCart.isError && <p className="text-red-500">Error fetching data</p>}
        <div className="w-full max-w-7xl px-4 md:px-5 lg-6 mx-auto">
          <h2 className="title font-inter font-bold text-4xl leading-10 mb-8 text-center text-black">
            Shopping Cart
          </h2>
          <div className="hidden lg:grid grid-cols-2 py-6">
            <div className="font-normal text-xl leading-8 text-gray-500">
              Product
            </div>
            <p className="font-normal text-xl leading-8 text-gray-500 flex items-center justify-center">
              <span className="w-full max-w-[200px] text-center lg:ml-32">
                Total
              </span>
            </p>
          </div>

          {getCart?.data?.images.map((image, index) => (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 min-[550px]:gap-6 border-t border-gray-200 py-6">
                <div className="flex items-center flex-col min-[550px]:flex-row gap-3 min-[550px]:gap-6 w-full max-xl:justify-center max-xl:max-w-xl max-xl:mx-auto">
                  <div className="img-box">
                    <img
                      src={image}
                      alt="perfume bottle image"
                      className="xl:w-[140px]"
                    />
                  </div>
                  <div className="pro-data w-full max-w-sm ">
                    <h5 className="font-semibold text-xl leading-8 text-black max-[550px]:text-center">
                      Image {index + 1}
                    </h5>
                    <p className="font-normal text-lg leading-8 text-gray-500 my-2 min-[550px]:my-3 max-[550px]:text-center">
                      Generative Image
                    </p>
                    <h6 className="font-medium text-lg leading-8 text-[#587cdd]  max-[550px]:text-center">
                      $60.00
                    </h6>
                  </div>
                </div>
                <div className="flex items-center flex-col min-[550px]:flex-row w-full max-xl:max-w-xl max-xl:mx-auto gap-10 justify-end">
                  <h6 className="text-[#587cdd] font-inter font-bold text-2xl leading-9 w-full max-w-[176px] text-center">
                    $60.00
                  </h6>
                  <button
                    className="bg-[#587cdd] text-white text-base px-4 py-3 rounded-md flex items-center gap-2 disabled:bg-[#c4c4c4] disabled:text-[#787878]"
                    disabled={deleteCart.isLoading}
                    onClick={() => deleteCart.mutate(image)}
                  >
                    <DeleteForever fontSize="small" />
                    Remove
                  </button>
                </div>
              </div>
            </>
          ))}
          <div className="bg-gray-50 rounded-xl p-6 w-full mb-8 max-lg:max-w-xl max-lg:mx-auto">
            <div className="flex items-center justify-between w-full mb-6">
              <p className="font-normal text-xl leading-8 text-gray-400">
                Sub Total
              </p>
              <h6 className="font-semibold text-xl leading-8 text-gray-900">
                ${totalPrice.toFixed(2)}
              </h6>
            </div>
            <div className="flex items-center justify-between w-full pb-6 border-b border-gray-200"></div>
            <div className="flex items-center justify-between w-full py-6">
              <p className="font-inter font-medium text-2xl leading-9 text-gray-900">
                Total
              </p>
              <h6 className="font-inter font-bold text-2xl leading-9 text-[#587cdd]">
                ${totalPrice.toFixed(2)}
              </h6>
            </div>
          </div>
          <div className="flex items-center flex-col sm:flex-row justify-center gap-3 mt-8">
            <button
              onClick={handleCheckout}
              className="rounded-md w-full max-w-[280px] py-4 text-center justify-center items-center bg-[#587cdd] font-semibold text-lg text-white flex transition-all duration-500 hover:bg-indigo-600  disabled:bg-[#c4c4c4] disabled:text-[#787878] "
              disabled={
                checkoutLoading ||
                !getCart.data ||
                getCart.data.images.length === 0
              }
            >
              Continue to Payment
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="23"
                height="22"
                viewBox="0 0 23 22"
                fill="none"
              >
                <path
                  d="M8.75324 5.49609L14.2535 10.9963L8.75 16.4998"
                  stroke="white"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
