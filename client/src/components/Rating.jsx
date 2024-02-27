import React, { useState, useContext, useEffect } from "react";
import "../css/rating.css";
import { fetchAddRate, fetchUserRate } from "../http/userAPI";
import { check } from "../http/userAPI";

import { Context } from "../main";

const Rating = ({ product }) => {
  const [totalValue, setTotalValue] = useState(1);

  const { user } = useContext(Context);

  useEffect(() => {
    const fetchUserRating = async () => {
      try {
        if (product.id) {
          // Проверка наличия product.id перед запросом
          const userRate = await fetchUserRate(user.id, product.id);
          setTotalValue(userRate.rate);
        } else {
          console.log("product.id не определён"); // Добавьте сообщение или обработку, если product.id не определён
        }
      } catch (error) {
        console.error("Ошибка получения рейтинга пользователя:", error.message);
      }
    };

    fetchUserRating();
  }, [user.id, product.id]);

  useEffect(() => {
    check();
  }, []);
  // console.log("idprod "+product.id)
  // console.log("idUser "+user.id)

  const handleRatingClick = async (value) => {
    setTotalValue(value);
    // console.log("value "+value)

    try {
      await fetchAddRate(value, user.id, product.id);
      // console.log(data);
    } catch (error) {
      console.error("Error adding rating:", error.response);
    }
  };

  return (
    <div className="rating" data-total-value={totalValue}>
      <div className="ratingItem" onClick={() => handleRatingClick(5)}>
        ★
      </div>
      <div className="ratingItem" onClick={() => handleRatingClick(4)}>
        ★
      </div>
      <div className="ratingItem" onClick={() => handleRatingClick(3)}>
        ★
      </div>
      <div className="ratingItem" onClick={() => handleRatingClick(2)}>
        ★
      </div>
      <div className="ratingItem" onClick={() => handleRatingClick(1)}>
        ★
      </div>
    </div>
  );
};

export default Rating;
