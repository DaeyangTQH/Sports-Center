package com.ecommerce.sportscenter.model;

import com.ecommerce.sportscenter.entity.Brand;
import com.ecommerce.sportscenter.entity.Type;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProductResponse {

    private int id;
    private String name;
    private String description;
    private double price;
    private String pictureUrl;
    private Brand brand;
    private Type type;
}
