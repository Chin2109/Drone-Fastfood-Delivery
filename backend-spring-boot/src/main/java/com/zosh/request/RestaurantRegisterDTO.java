package com.zosh.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
public class RestaurantRegisterDTO {
    private String restaurantName; // 25. Tên cửa hàng
    private String representativeName; // Tên người đại diện
    private String representativeEmail; // 8. Email
    private String representativePhoneNumber; // 9. Số điện thoại
    private String restaurantAddress; // 28. Địa chỉ cửa hàng
    private String businessModel; // 1. Mô hình kinh doanh: công ty/hkd/cá nhân
    private static int dailyOrderVolume = 100; // Số lượng đơn hàng trong 1 ngày

    // --- 1. Thông tin Đăng ký & Mô hình ---
    private String registrationType; // 2. Hình thức đăng ký: đk nhà hàng mới
    private String legalBusinessName; // 4. Tên đăng ký kinh doanh đầy đủ
    private String businessRegistrationCode; // 5. Mã số doanh nghiệp
    private LocalDate registrationDate; // 6. Ngày đăng ký kinh doanh
    private String businessIndustry; // 7. Tên ngành nghề kinh doanh
    private List<RegisterImageDTO> images;

    // --- 7. Thông tin Ngân hàng ---
    private String bankName; // Thông tin ngân hàng
    private String bankAccountNumber; // 13. Số tài khoản
    private String bankAccountHolderName; // 14. Tên chủ tài khoản ngân hàng

    // --- 4. Thông tin Chủ sở hữu (Owner) - Theo CCCD/CMND ---
    private String ownerName; // 15. Tên người sở hữu
    private LocalDate ownerDateOfBirth; // 16. Ngày sinh
    private String ownerIdNumber; // 17. Số CMND/CCCD
    private LocalDate ownerIdIssueDate; // 18. Ngày cấp
    private String ownerIdIssuePlace; // 19. Nơi cấp
    private LocalDate ownerIdExpiryDate; // 20. Ngày hết hạn CMND/CCCD
    private String ownerPermanentAddress; // 21. Địa chỉ thường trú
    private String ownerCountry; // 22. Quốc gia
    private String ownerCity; // 23. Thành phố
    private String ownerCurrentAddress; // 24. Địa chỉ nơi ở hiện tại

    // --- 5. Thông tin Cửa hàng (Restaurant Details) ---
    private String restaurantEmail; // 26. Email cửa hàng
    private String restaurantPhoneNumber; // 27. Số điện thoại cửa hàng
}