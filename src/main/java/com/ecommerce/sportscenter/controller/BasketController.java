package com.ecommerce.sportscenter.controller;

import com.ecommerce.sportscenter.entity.Basket;
import com.ecommerce.sportscenter.entity.BasketItem;
import com.ecommerce.sportscenter.model.BasketItemResponse;
import com.ecommerce.sportscenter.model.BasketResponse;
import com.ecommerce.sportscenter.service.BasketService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/baskets")
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
@RequiredArgsConstructor
public class BasketController {

    BasketService basketService;

    @GetMapping
    public List<BasketResponse> getAllBaskets() {
        return basketService.getAllBaskets();
    }

    @GetMapping("/{id}")
    public BasketResponse getBasketById(@PathVariable String id) {
        return basketService.getBasketById(id);
    }

    @DeleteMapping("/{id}")
    public void deleteBasketById(@PathVariable String id) {
        basketService.deleteBasketById(id);
    }

    @PostMapping
    public ResponseEntity<BasketResponse> createBasket(@RequestBody BasketResponse basketResponse) {
        Basket basket = basketResponsetoBasket(basketResponse);
        BasketResponse createdBasket = basketService.createBasket(basket);
        return new ResponseEntity<>(createdBasket, HttpStatus.CREATED);
    }

    private Basket basketResponsetoBasket(BasketResponse basketResponse) {
        Basket basket = new Basket();
        basket.setId(basketResponse.getId());
        basket.setItems(basketResponse.getBasketItems().stream().map(this::toBasketItem).collect(Collectors.toList()));
        return basket;
    }

    private BasketItem toBasketItem(BasketItemResponse basketItemResponse) {
        BasketItem basketItem = new BasketItem();
        basketItem.setId(basketItemResponse.getId());
        basketItem.setName(basketItemResponse.getName());
        basketItem.setDescription(basketItemResponse.getDescription());
        basketItem.setPrice(basketItemResponse.getPrice());
        basketItem.setQuantity(basketItemResponse.getQuantity());
        basketItem.setPictureUrl(basketItemResponse.getPictureUrl());
        basketItem.setProductBrand(basketItemResponse.getProductBrand());
        basketItem.setProductType(basketItemResponse.getProductType());
        return basketItem;
    }
}
