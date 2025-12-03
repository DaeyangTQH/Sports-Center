package com.ecommerce.sportscenter.service;

import com.ecommerce.sportscenter.entity.Product;
import com.ecommerce.sportscenter.exception.ProductNotFoundException;
import com.ecommerce.sportscenter.model.ProductResponse;
import com.ecommerce.sportscenter.repository.ProductRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService{

    ProductRepository productRepository;


    @Override
    public ProductResponse getProductById(int id) {
        log.info("Fetching Product with id: {}", id);
        Product product = productRepository.findById(id).orElseThrow(() -> new ProductNotFoundException("Product with id: " + id + " not found"));
        log.info("Fetched Product with id: {}", id);
        return convertToProductResponse(product);
    }

    @Override
    public Page<ProductResponse> getAllProducts(Pageable pageable, Integer brandId, Integer typeId, String keyword) {
        log.info("Fetching All Products!!!");
        Specification<Product> spec = ((root, query, criteriaBuilder) -> null);

        if(brandId != null){
            spec = spec.and((root, query, cb) -> cb.equal(root.get("brand").get("id"),  brandId));
        }

        if(typeId != null){
            spec = spec.and((root, query, cb) -> cb.equal(root.get("type").get("id"),  typeId));
        }

        if(keyword != null && !keyword.isBlank()){
            spec = spec.and((root, query, cb) -> cb.like(root.get("name"), "%" + keyword + "%"));
        }
        log.info("Fetched All Products!!!");
        return productRepository.findAll(spec, pageable).map(this::convertToProductResponse);
    }

    private ProductResponse convertToProductResponse(Product product){
        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .productType(product.getType().getName())
                .productBrand(product.getBrand().getName())
                .price(product.getPrice())
                .description(product.getDescription())
                .pictureUrl(product.getPictureUrl())
                .build();
    }

}
