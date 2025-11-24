package com.zosh.service;

import com.zosh.domain.RestaurantRegisterImage;
import com.zosh.model.Restaurant;
import com.zosh.model.RestaurantImage;
import com.zosh.repository.RestaurantImageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RestaurantImageService {

    private final RestaurantImageRepository restaurantImageRepository;

    public Map<RestaurantRegisterImage, String> get4Images(Restaurant restaurant) {
        List<RestaurantRegisterImage> types = List.of(
                RestaurantRegisterImage.IDENTITY,
                RestaurantRegisterImage.BUSINESS,
                RestaurantRegisterImage.FOOD,
                RestaurantRegisterImage.OTHERS
        );

        return restaurantImageRepository
                .findByRestaurantAndTypeIn(restaurant, types)
                .stream()
                .collect(Collectors.toMap(
                        RestaurantImage::getType,
                        RestaurantImage::getUrl,
                        (a, b) -> a
                ));
    }
}

