package com.zosh.controller;

import com.zosh.dto.PaymentDTO;
import com.zosh.service.PaymentService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/payment")
@RequiredArgsConstructor
public class PaymentController {
    private final PaymentService paymentService;

    @GetMapping("/vn-pay")
    public ResponseEntity<PaymentDTO.VNPayResponse> pay(HttpServletRequest request) {
        return ResponseEntity.ok(paymentService.createVnPayPayment(request));
    }

    @GetMapping("/vn-pay-callback")
    public ResponseEntity<PaymentDTO.VNPayResponse> payCallbackHandler(HttpServletRequest request) {
        String status = request.getParameter("vnp_ResponseCode");
        if (status.equals("00")) {
            return ResponseEntity.ok(new PaymentDTO.VNPayResponse("00", "Success", ""));
        } else {
            return ResponseEntity.ok(new PaymentDTO.VNPayResponse("01", "Failed", ""));
        }
    }
}
