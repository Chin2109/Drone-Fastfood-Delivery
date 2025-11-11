package com.zosh.model;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import com.zosh.domain.RestaurantStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Restaurant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @OneToOne
    private User owner;
    private String representativeName; // Tên người đại diện
    
    private String name; // Tên nhà hàng
    private String description;

    @ManyToOne
    @JoinColumn(name = "address_id")
    private Address address;
    private String representativeEmail; //email người đại diện
    private String representativemobile; //số điện thoại người đại diện
    private String openingHours;
    private boolean is_temporarily_closed;

    @JsonIgnore
    @OneToMany(mappedBy="restaurant",cascade=CascadeType.ALL,orphanRemoval = true)
    private List<Order> orders=new ArrayList<>();

//    @ElementCollection vì đang dùng List, nếu không muốn JPA tạo ra từng table riêng thì phải z để tạo ra bảng
//    @Column(length = 1000)
    private String image;
    private boolean open;

    @OneToMany(mappedBy = "restaurant", cascade = CascadeType.ALL)
    private List<Category> categories = new ArrayList<>();

    private String businessModel; // 1. Mô hình kinh doanh: công ty/hkd/cá nhân
    private static int dailyOrderVolume; // Số lượng đơn hàng trong 1 ngày
    private String registrationType; // 2. Hình thức đăng ký: đk nhà hàng mới
    private String legalBusinessName; // 4. Tên đăng ký kinh doanh đầy đủ
    private String businessRegistrationCode; // 5. Mã số doanh nghiệp
    private LocalDate registrationDate; // 6. Ngày đăng ký kinh doanh
    private String businessIndustry; // 7. Tên ngành nghề kinh doanh

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

    @OneToMany(mappedBy = "restaurant")
    List<RestaurantImage> restaurantImages;

    private RestaurantStatus status;
}

