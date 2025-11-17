package com.zosh.request;

import lombok.Data;

import java.util.List;

@Data
public class CartPreviewRequest {
    private List<Long> cartItemId;
}
