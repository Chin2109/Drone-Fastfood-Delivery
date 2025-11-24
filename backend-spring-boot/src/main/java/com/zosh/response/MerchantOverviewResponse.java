package com.zosh.response;

import lombok.Data;

@Data
public class MerchantOverviewResponse {
    private Long id; // restaurant id

    // 1. Thông tin cửa hàng
    private String name;
    private String representativeName;
    private String merchantEmail;
    private String merchantPhoneNumber;
    private String restaurantAddress;
    private Double restaurantLat;
    private Double restaurantLng;
    private String businessModel;
    private Integer dailyOrderVolume;

    // 2. Thông tin pháp lý
    private String registrationType;
    private String legalBusinessName;
    private String businessRegistrationCode;
    private String registrationDate; // String cho dễ format ra FE
    private String businessIndustry;

    // 3. Thông tin ngân hàng
    private String bankName;
    private String bankAccountNumber;
    private String bankAccountHolderName;

    // 4. Thông tin chủ sở hữu
    private String ownerName;
    private String ownerDateOfBirth;
    private String ownerIdNumber;
    private String ownerIdIssueDate;
    private String ownerIdIssuePlace;
    private String ownerIdExpiryDate;
    private String ownerPermanentAddress;
    private String ownerCountry;
    private String ownerCity;
    private String ownerCurrentAddress;

    //hình
    private String identity;
    private String business;
    private String kitchen;
    private String others;
}
