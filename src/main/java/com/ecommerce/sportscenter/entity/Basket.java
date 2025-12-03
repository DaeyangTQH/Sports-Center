package com.ecommerce.sportscenter.entity;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.redis.core.RedisHash;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@RedisHash("Basket")
public class Basket {

    String id;
    List<BasketItem> items = new ArrayList<>();

    public Basket(String id) {
        this.id = id;
    }
}
