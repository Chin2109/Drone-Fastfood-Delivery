package com.zosh.response;

import lombok.Data;

@Data
public class RegisterUserResponse {
    private Long id;
    private String email;
    private String role;
}
