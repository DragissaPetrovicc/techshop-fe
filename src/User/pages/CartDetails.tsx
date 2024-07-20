import React, { useState, useCallback, useEffect, useRef } from "react";
import { UserRoute } from "../../PrivateRoutes.tsx";
import { useTranslation } from "react-i18next";
import Product from "../../Guest/Components/Product.tsx";
import { Alert, Button } from "@mui/material";
import { useParams } from "react-router-dom";
import Loader from "../../CustomLoader.tsx";
import { axiosT } from "../../config/axios.ts";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../Redux/config.ts";
import {
  removeCartArticles,
  setCartArticles,
} from "../../Redux/slices/cartArticles.ts";
import { loadStripe } from "@stripe/stripe-js";

const CartDetails: React.FC = () => {
  const { t } = useTranslation();

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [cart, setCart] = useState<any>(null);
  const [price, setPrice] = useState<number>(0);
  const dispatch = useDispatch<AppDispatch>();
  const [ids, setIds] = useState<string[]>([]);
  const [refreshProducts, setRefreshProducts] = useState<boolean>(false);

  const idsRef = useRef<string[]>(ids);

  const fetchProducts = useCallback(() => {
    setRefreshProducts((prev) => !prev);
  }, []);

  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const { data } = await axiosT.get(`/cart/${id}`);
        setCart(data);

        const totalPrice = data.products.reduce(
          (acc: number, p: any) => acc + p.price,
          0
        );
        setPrice(totalPrice);
        const newIds = data.products.map((p: any) => p._id);
        setIds(newIds);
      } catch (e: any) {
        setError(e?.response?.data || "An error occurred");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  useEffect(() => {
    if (idsRef.current === ids) {
      dispatch(setCartArticles(ids));
      idsRef.current = ids;
    }
  }, [ids, dispatch]);

  const pay = async () => {
    try {
      setLoading(true);

      const stripe = await loadStripe(
        "pk_test_51PZavoLHGK9IimVjABkAvySUDlv5UFMVshpOtDkpmFqY1zk0Jp0Olt7u1fDjOywhEouxdVzG1LJYt5LyOptXVtDS00p5wPSgkI"
      );

      const { data } = await axiosT.post("/purchase/pay", {
        products: cart.products,
      });
      dispatch(removeCartArticles());
      stripe?.redirectToCheckout({
        sessionId: data.id,
      });
    } catch (e: any) {
      setError(e?.response?.data || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserRoute>
      <div className="flex flex-col w-full h-full gap-12">
        <span className="text-customYellow text-xl md:text-3xl font-bold text-center">
          {t("cart")} - ( {cart?.name} )
        </span>
        <div className="w-full h-full flex flex-col md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {!!error ? (
            <Alert severity="error" variant="filled">
              {error}
            </Alert>
          ) : (
            <Product
              key={refreshProducts.toString()}
              fetchProducts={fetchProducts}
            />
          )}
        </div>
        <Button
          onClick={pay}
          className="!w-min !self-center !whitespace-nowrap !bg-customYellow !text-black !font-semibold"
          variant="contained"
        >
          {!!loading ? <Loader /> : `${t("pay")} ${price}$`}
        </Button>
      </div>
    </UserRoute>
  );
};

export default CartDetails;
