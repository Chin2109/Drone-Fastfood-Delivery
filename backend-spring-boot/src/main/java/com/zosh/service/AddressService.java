package com.zosh.service;

import com.zosh.model.Address;
import com.zosh.request.CreateAddress;
import org.locationtech.jts.geom.Point;

public interface AddressService {
    public Address saveAddress(CreateAddress request);
    public Point toPoint(double lat, double lng);
    public String getFullAddress(double lat, double lng);
    public double calculateDistanceKm(double lat1, double lng1, double lat2, double lng2);
    public double calculateDistanceKm(String addr1, String addr2);
}
