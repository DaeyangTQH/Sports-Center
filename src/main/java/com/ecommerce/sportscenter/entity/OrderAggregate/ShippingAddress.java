package com.ecommerce.sportscenter.entity.OrderAggregate;

import jakarta.persistence.Embeddable;
import lombok.*;
import lombok.experimental.FieldDefaults;

@FieldDefaults(level = AccessLevel.PRIVATE)
@Embeddable
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ShippingAddress {

    String name;
    String address1;
    String address2;
    String city;
    String state;
    String zipcode;
    String country;
}
