
package com.zosh.mapper;

import com.zosh.model.Address;
import com.zosh.model.OrderItem;
import com.zosh.response.OrderDetailResponse;
import com.zosh.response.OrderSummaryResponse;
import com.zosh.model.Order;
import com.zosh.model.Restaurant;

import java.text.NumberFormat;
import java.text.SimpleDateFormat;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

public class OrderMapper {

    private static final SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

    public static OrderSummaryResponse toSummary(Order order) {
        OrderSummaryResponse dto = new OrderSummaryResponse();
        dto.setId(order.getId());
        dto.setOrderStatus(order.getOrderStatus());
        dto.setTotalAmount(order.getTotalAmount() != null ? order.getTotalAmount() : order.getTotalPrice());

        if (order.getCreatedAt() != null) {
            dto.setCreatedAt(sdf.format(order.getCreatedAt()));
        }

        Restaurant restaurant = order.getRestaurant();
        if (restaurant != null) {
            OrderSummaryResponse.RestaurantSummary r = new OrderSummaryResponse.RestaurantSummary();
            r.setId(restaurant.getId());
            r.setName(restaurant.getName());
            // tuỳ theo entity Restaurant của bạn
//            r.setImage( /* hoặc getLogo() */);
            dto.setRestaurant(r);
        }

        return dto;
    }

    private static final NumberFormat VND_FORMAT =
            NumberFormat.getInstance(new Locale("vi", "VN"));

    public static OrderDetailResponse toDetail(Order order) {
        OrderDetailResponse dto = new OrderDetailResponse();

        dto.setId(order.getId());
        dto.setStatus(order.getOrderStatus());

        // merchantName hiển thị ở header
        if (order.getRestaurant() != null) {
            dto.setMerchantName(order.getRestaurant().getName());
            dto.setRestaurant(toRestaurantDto(order.getRestaurant()));
        }

        // địa chỉ giao hàng
        if (order.getDeliveryAddress() != null) {
            Address da = order.getDeliveryAddress();
            // tuỳ structure Address của bạn
            String full = da.getFullName() != null
                    ? da.getFullName()
                    : da.getFullName(); // fallback
            dto.setDeliveryAddress(full);
            dto.setDeliveryLat(da.getLatitude());
            dto.setDeliveryLng(da.getLongitude());
        }

        // subtotal, finalTotal, deliveryFee
        Long subtotal = order.getTotalPrice() != null ? order.getTotalPrice() : 0L;
        Long finalTotal = order.getTotalAmount() != null ? order.getTotalAmount() : subtotal;
        Long deliveryFee = finalTotal - subtotal;
        if (deliveryFee < 0) deliveryFee = 0L;

        dto.setSubtotal(subtotal);
        dto.setFinalTotal(finalTotal);
        dto.setDeliveryFee(deliveryFee);

        // items
        List<OrderItem> items = order.getItems();
        if (items != null) {
            dto.setItems(
                    items.stream()
                            .map(OrderMapper::toItemDto)
                            .collect(Collectors.toList())
            );
        }

        return dto;
    }

    private static OrderDetailResponse.RestaurantDto toRestaurantDto(Restaurant r) {
        if (r == null) return null;
        OrderDetailResponse.RestaurantDto dto = new OrderDetailResponse.RestaurantDto();
        dto.setId(r.getId());
        dto.setName(r.getName());

        if (r.getAddress() != null) {
            Address addr = r.getAddress();
            OrderDetailResponse.AddressDto ad = new OrderDetailResponse.AddressDto();
            ad.setLatitude(addr.getLatitude());
            ad.setLongitude(addr.getLongitude());
            // nếu Address có location GeoJSON thì map thêm
            dto.setAddress(ad);
        }

        return dto;
    }

    private static OrderDetailResponse.ItemDto toItemDto(OrderItem item) {
        OrderDetailResponse.ItemDto dto = new OrderDetailResponse.ItemDto();
        dto.setId(item.getId());
        if (item.getFood() != null) {
            dto.setProductName(item.getFood().getName());
        }
        dto.setQuantity(item.getQuantity());
        dto.setTotalPrice(item.getTotalPrice());

        if (item.getTotalPrice() != null) {
            String formatted = VND_FORMAT.format(item.getTotalPrice()) + "₫";
            dto.setTotalPriceFormatted(formatted);
        }
        return dto;
    }
}
