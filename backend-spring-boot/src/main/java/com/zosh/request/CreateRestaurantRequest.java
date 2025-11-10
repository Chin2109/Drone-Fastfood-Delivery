package com.zosh.request;

import java.time.LocalDateTime;
import java.util.List;

import com.zosh.model.Address;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data
public class CreateRestaurantRequest {

	private Long id;
	private String name;
	private String description;
	private String cuisineType;
	private Address address;
	private String openingHours;
	private String image;
    private LocalDateTime registrationDate;
	private String mobile;
}
