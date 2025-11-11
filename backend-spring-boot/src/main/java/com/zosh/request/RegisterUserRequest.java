package com.zosh.request;

import lombok.Data;

@Data
public class RegisterUserRequest {
    String email;
    String password;
    String role;
}
