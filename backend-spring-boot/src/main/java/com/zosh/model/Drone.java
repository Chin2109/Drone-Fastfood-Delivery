package com.zosh.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.zosh.domain.DroneStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.locationtech.jts.geom.Point;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Drone {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private int battery;

    @Enumerated(EnumType.STRING) //Lưu string của enum, thay vì mặc định là index (số)
    private DroneStatus status;

    @Column(columnDefinition = "POINT")
    @JsonIgnore //ẩn cấu trúc Point phức tạp của jts khỏi quá trình json hóa tự động
    //nó vẫn là kiểu dữ liệu Point, nhưng khi json hóa để giao tiếp, nó sẽ chỉ có dạng json lat và long
    private Point location;
    //dùng getter để jackson trả ra json
    public Double getLatitude() {
        return location != null ? location.getY() : null;
    }
    public Double getLongitude() {
        return location != null ? location.getX() : null;
    }

    @ManyToOne
    private DroneHub hub;

    @OneToOne
    private Order order;

    // 4. Thông số Kỹ thuật
    private Double payloadCapacityKg; // Tải trọng tối đa
    private String serialNumber; // Số series/tên gọi của drone

    // 5. Mission Planner/Pixhawk ID: dùng để giao tiếp qua MAVLink/GCS
    private String telemetryId;
}
