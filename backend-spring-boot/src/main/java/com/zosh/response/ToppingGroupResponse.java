package com.zosh.response;

import lombok.Data;

import java.util.List;

@Data
public class ToppingGroupResponse {
    private Long id;
    private String name;
    private boolean is_required;
    private Integer minSelection;
    private Integer maxSelection;

    private List<ToppingResponse> toppings;
}
