package com.ecommerce.sportscenter.entity.OrderAggregate;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "OrderItem")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderItem {

    @Id @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "Id")
    Integer id;

    @Embedded
    private ProductItemOrdered productItemOrdered;

    @Column(name = "Price")
    Long price;

    @Column(name = "Quantity")
    Long quantity;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    Order order;
}
