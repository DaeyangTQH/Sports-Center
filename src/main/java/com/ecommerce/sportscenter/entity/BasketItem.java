package com.ecommerce.sportscenter.entity;

import jakarta.persistence.Id;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.redis.core.RedisHash;

@Data
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@RedisHash("BasketItem")
public class BasketItem {
    @Id
    Integer id;
    String name;
    String description;
    Long price;
    String pictureUrl;
    String productBrand;
    String productType;
    Integer quantity;
}
