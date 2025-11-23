package com.ecommerce.sportscenter.service;

import com.ecommerce.sportscenter.entity.Type;
import com.ecommerce.sportscenter.model.TypeResponse;
import com.ecommerce.sportscenter.repository.TypeRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class TypeServiceImpl implements TypeService {

    TypeRepository typeRepository;

    @Override
    public List<TypeResponse> getAllTypes() {
        log.info("Fetching All Types!!!");
        List<Type> typeList = typeRepository.findAll();
        return typeList.stream()
                .map(this::convertToTypeResponse)
                .collect(Collectors.toList());
    }

    private TypeResponse convertToTypeResponse(Type type){
        return TypeResponse.builder()
                .id(type.getId())
                .name(type.getName())
                .build();
    }
}
