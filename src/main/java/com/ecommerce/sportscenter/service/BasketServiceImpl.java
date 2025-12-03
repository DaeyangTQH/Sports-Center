package com.ecommerce.sportscenter.service;

import com.ecommerce.sportscenter.entity.Basket;
import com.ecommerce.sportscenter.entity.BasketItem;
import com.ecommerce.sportscenter.model.BasketItemResponse;
import com.ecommerce.sportscenter.model.BasketResponse;
import com.ecommerce.sportscenter.repository.BasketRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Log4j2
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class BasketServiceImpl implements BasketService {

    BasketRepository basketRepository;

    @Override
    public List<BasketResponse> getAllBaskets() {
        log.info("Fetch all baskets");
        List<Basket> baskets = (List<Basket>) basketRepository.findAll();
        log.info("Fetched all baskets");
        return baskets.stream()
                .map(this::toBasketResponse)
                .collect(Collectors.toList());
    }

    @Override
    public BasketResponse getBasketById(String id) {
        log.info("Fetch basket by id: {}", id);
        Optional<Basket> optionalBasket = basketRepository.findById(id);
        if (optionalBasket.isPresent()) {
            Basket basket = optionalBasket.get();
            log.info("Fetched basket by id: {}", basket.getId());
            return toBasketResponse(basket);
        } else {
            log.info("Basket with id {} not found", id);
            return null;
        }
    }

    @Override
    public void deleteBasketById(String id) {
        log.info("Delete basket by id: {}", id);
        basketRepository.deleteById(id);
        log.info("Deleted basket by id: {}", id);
    }

    @Override
    public BasketResponse createBasket(Basket basket) {
        log.info("Create basket: {}", basket);
        Basket newBasket = basketRepository.save(basket);
        log.info("Created basket with id: {}", newBasket.getId());
        return toBasketResponse(newBasket);
    }

    private BasketResponse toBasketResponse(Basket basket) {
        if (basket == null) return null;
        return BasketResponse.builder()
                .id(basket.getId())
                .basketItems(basket.getItems().stream().map(this::toBasketItemResponse).collect(Collectors.toList()))
                .build();
    }

    private BasketItemResponse toBasketItemResponse(BasketItem basketItem) {
        return BasketItemResponse.builder()
                .id(basketItem.getId())
                .name(basketItem.getName())
                .price(basketItem.getPrice())
                .description(basketItem.getDescription())
                .price(basketItem.getPrice())
                .pictureUrl(basketItem.getPictureUrl())
                .productBrand(basketItem.getProductBrand())
                .productType(basketItem.getProductType())
                .build();
    }
}
