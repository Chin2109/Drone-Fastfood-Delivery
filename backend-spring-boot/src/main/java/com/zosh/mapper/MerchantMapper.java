package com.zosh.mapper;


import com.zosh.model.Address;
import com.zosh.model.Restaurant;
import com.zosh.response.MerchantOverviewResponse;

import java.time.format.DateTimeFormatter;

public class MerchantMapper {

    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ISO_DATE;

    public static MerchantOverviewResponse toOverview(Restaurant r) {
        MerchantOverviewResponse dto = new MerchantOverviewResponse();
        dto.setId(r.getId());

        // 1. Thông tin cửa hàng
        dto.setName(r.getName());
        dto.setRepresentativeName(r.getRepresentativeName());

        // bạn có Restaurant.representativeEmail + restaurantEmail
        // map "merchantEmail" tuỳ bạn muốn show cái nào
        dto.setMerchantEmail(
                r.getRestaurantEmail() != null
                        ? r.getRestaurantEmail()
                        : r.getRepresentativeEmail()
        );

        dto.setMerchantPhoneNumber(
                r.getRestaurantPhoneNumber() != null
                        ? r.getRestaurantPhoneNumber()
                        : r.getRepresentativemobile()
        );

        Address addr = r.getAddress();
        if (addr != null) {
            dto.setRestaurantAddress(addr.getFullName());
            dto.setRestaurantLat(addr.getLatitude());
            dto.setRestaurantLng(addr.getLongitude());
        }

        dto.setBusinessModel(r.getBusinessModel());
        dto.setDailyOrderVolume(r.getDailyOrderVolume());

        // 2. Pháp lý
        dto.setRegistrationType(r.getRegistrationType());
        dto.setLegalBusinessName(r.getLegalBusinessName());
        dto.setBusinessRegistrationCode(r.getBusinessRegistrationCode());
        if (r.getRegistrationDate() != null) {
            dto.setRegistrationDate(r.getRegistrationDate().format(DATE_FMT));
        }
        dto.setBusinessIndustry(r.getBusinessIndustry());

        // 3. Ngân hàng
        dto.setBankName(r.getBankName());
        dto.setBankAccountNumber(r.getBankAccountNumber());
        dto.setBankAccountHolderName(r.getBankAccountHolderName());

        // 4. Chủ sở hữu
        dto.setOwnerName(r.getOwnerName());
        if (r.getOwnerDateOfBirth() != null) {
            dto.setOwnerDateOfBirth(r.getOwnerDateOfBirth().format(DATE_FMT));
        }
        dto.setOwnerIdNumber(r.getOwnerIdNumber());
        if (r.getOwnerIdIssueDate() != null) {
            dto.setOwnerIdIssueDate(r.getOwnerIdIssueDate().format(DATE_FMT));
        }
        dto.setOwnerIdIssuePlace(r.getOwnerIdIssuePlace());
        if (r.getOwnerIdExpiryDate() != null) {
            dto.setOwnerIdExpiryDate(r.getOwnerIdExpiryDate().format(DATE_FMT));
        }
        dto.setOwnerPermanentAddress(r.getOwnerPermanentAddress());
        dto.setOwnerCountry(r.getOwnerCountry());
        dto.setOwnerCity(r.getOwnerCity());
        dto.setOwnerCurrentAddress(r.getOwnerCurrentAddress());

        return dto;
    }
}
