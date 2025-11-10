package com.zosh.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
public class RegisterImageDTO {
    private String source;
    private RestaurantRegisterDTO type;
}
