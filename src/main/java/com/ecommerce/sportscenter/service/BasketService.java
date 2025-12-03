package com.ecommerce.sportscenter.service;

import com.ecommerce.sportscenter.entity.Basket;
import com.ecommerce.sportscenter.entity.BasketItem;
import com.ecommerce.sportscenter.model.BasketItemResponse;
import com.ecommerce.sportscenter.model.BasketResponse;

import java.util.List;

public interface BasketService  {

    List<BasketResponse> getAllBaskets();
    BasketResponse getBasketById(String id);
    void deleteBasketById(String id);
    BasketResponse createBasket(Basket basket);
}
