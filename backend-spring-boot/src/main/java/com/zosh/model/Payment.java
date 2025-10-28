package com.zosh.model;

import java.time.LocalDateTime;
import java.util.Date;

import com.zosh.domain.PaymentStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long orderId;
    private String paymentMethod;
    private String paymentStatus;
    private double totalAmount;

    // === Dữ liệu do VNPAY cung cấp ===
    private String vnpTxnRef;           // Mã tham chiếu giao dịch (unique per order)
    private String vnpTransactionNo;    // Mã giao dịch tại VNPAY (vnp_TransactionNo)
    private String vnpResponseCode;     // Mã phản hồi (00 = thành công)
    private String vnpOrderInfo;        // Mô tả đơn hàng gửi sang VNPAY
    private String vnpBankCode;         // Mã ngân hàng người dùng chọn
    private String vnpCardType;         // Loại thẻ (ATM, VISA,…)
    private String vnpPayDate;          // Ngày thanh toán (yyyyMMddHHmmss)
    private String vnpSecureHash;       // Mã checksum xác thực

    // === Trạng thái hệ thống ===
    @Enumerated(EnumType.STRING)
    private PaymentStatus status;       // PENDING, SUCCESS, FAILED, CANCELLED

    private LocalDateTime createdAt;    // Lúc tạo yêu cầu thanh toán
    private LocalDateTime updatedAt;    // Lúc cập nhật trạng thái
}

