package com.zosh.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;
import java.util.List;

@Data
public class RestaurantRegisterDTO {
    private String name;
    private String representativeName;
    private String merchantEmail;
    private String merchantPhoneNumber;
    private String restaurantAddress;
    private Double restaurantLat;
    private Double restaurantLng;
    private String businessModel;
    private Integer dailyOrderVolume;

    private String registrationType;
    private String legalBusinessName;
    private String businessRegistrationCode;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate registrationDate;
    private String businessIndustry;

    private String bankName;
    private String bankAccountNumber;
    private String bankAccountHolderName;

    private String ownerName;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate ownerDateOfBirth;
    private String ownerIdNumber;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate ownerIdIssueDate;
    private String ownerIdIssuePlace;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate ownerIdExpiryDate;
    private String ownerPermanentAddress;
    private String ownerCountry;
    private String ownerCity;
    private String ownerCurrentAddress;
}