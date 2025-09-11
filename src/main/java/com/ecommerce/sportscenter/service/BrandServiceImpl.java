package com.ecommerce.sportscenter.service;

import com.ecommerce.sportscenter.entity.Brand;
import com.ecommerce.sportscenter.model.BrandResponse;
import com.ecommerce.sportscenter.repository.BrandRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Log4j2
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class BrandServiceImpl implements BrandService {

    BrandRepository brandRepository;

    @Override
    public List<BrandResponse> getAllBrands() {
        log.info("Fetching All Brands!!!");
        List<Brand> brands = brandRepository.findAll();
        // Use stream operator to map with Response
        List<BrandResponse> responses = brands.stream().map(this::convertToBrandResponse).collect(Collectors.toList());
        log.info("Fetched All Brands!!!");
        return responses;
    }

    private BrandResponse convertToBrandResponse(Brand brand) {
        return BrandResponse.builder().
                id(brand.getId()).
                name(brand.getName()).
                build();
    }
}
