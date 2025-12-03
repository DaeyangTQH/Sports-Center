package com.ecommerce.sportscenter.model;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@AllArgsConstructor
public class BasketItemResponse {
    Integer id;
    String name;
    String description;
    Long price;
    String pictureUrl;
    String productBrand;
    String productType;
    Integer quantity;
}
