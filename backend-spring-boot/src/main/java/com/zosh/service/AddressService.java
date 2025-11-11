package com.zosh.service;

import com.zosh.model.Address;
import com.zosh.request.CreateAddress;

public interface AddressService {
    public Address saveAddress(CreateAddress request);
}
