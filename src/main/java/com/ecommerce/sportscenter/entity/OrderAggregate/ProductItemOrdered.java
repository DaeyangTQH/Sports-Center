package com.ecommerce.sportscenter.entity.OrderAggregate;

import jakarta.persistence.Embeddable;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Embeddable
@FieldDefaults(level = AccessLevel.PRIVATE)
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProductItemOrdered {
    Integer productId;
    String productName;
    String pictureUrl;
}
