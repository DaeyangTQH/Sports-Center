package com.ecommerce.sportscenter.entity.OrderAggregate;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "Order")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "Id")
    Integer id;

    @Column(name = "Basket_id")
    String basketId;

    @Embedded
    ShippingAddress shippingAddress;

    @Column(name = "Order_Data")
    private LocalDateTime orderDate = LocalDateTime.now();

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "order")
    private List<OrderItem> orderItems;

    @Column(name = "Sub_Total")
    Double subTotal;

    @Column(name = "Delivery_Fee")
    Long deliveryFee;

    @Enumerated(EnumType.STRING)
    @Column(name = "Order_Status")
    OrderStatus orderStatus = OrderStatus.Pending;

    public Double getTotal() {
        return getSubTotal() + getDeliveryFee();
    }
}
