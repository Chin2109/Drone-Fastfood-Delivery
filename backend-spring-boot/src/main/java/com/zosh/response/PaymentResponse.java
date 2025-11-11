package com.zosh.response;

import lombok.Data;

@Data
public class PaymentResponse {
    private String payment_url;     // URL VNPAY redirect người dùng tới để thanh toán
}
