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

    // ====== Trạng thái hoạt động ======
    @Column(nullable = false)
    private int battery;

    @Enumerated(EnumType.STRING)
    private DroneStatus status;

    @Column(columnDefinition = "POINT")
    @JsonIgnore
    private Point location;

    // dùng getter để jackson trả ra json đơn giản
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

    // ====== Thông số kỹ thuật cơ bản ======
    private Double payloadCapacityKg;   // Tải trọng tối đa
    private String serialNumber;        // Số series/tên gọi của drone
    private String telemetryId;         // ID dùng cho MAVLink / Pixhawk

    // ====== Thông số kỹ thuật chi tiết (theo spec DJI) ======

    // Trọng lượng cất cánh (gram)
    private Double takeoffWeightGrams;  // vd: 1063.0

    // Kích thước (lưu dạng text để show UI, đỡ phức tạp)
    private String sizeFoldedWithProps;       // "257.6 × 124.8 × 106.6 mm"
    private String sizeFoldedWithoutProps;    // "257.6 × 124.8 × 103.4 mm"
    private String sizeUnfoldedWithoutProps;  // "328.7 × 390.5 × 135.2 mm"

    // Tốc độ tăng tối đa (m/s)
    private Double maxAscentSpeedSportMs;   // 10 m/s
    private Double maxAscentSpeedNormalMs;  // 6 m/s
    private Double maxAscentSpeedCineMs;    // 6 m/s

    // Tốc độ hạ tối đa (m/s)
    private Double maxDescentSpeedSportMs;   // 10 m/s
    private Double maxDescentSpeedNormalMs;  // 6 m/s
    private Double maxDescentSpeedCineMs;    // 6 m/s

    // Tốc độ ngang tối đa (m/s)
    private Double maxHorizontalSpeedSportMs;      // 25 m/s (hoặc 27 với gió đuôi)
    private Double maxHorizontalSpeedTrackingMs;   // 15 m/s

    // Độ cao cất cánh tối đa (m)
    private Double maxTakeoffAltitudeM;          // 6000 m
    private Double maxTakeoffAltitudeWithGuardsM; // 3000 m (khi gắn propeller guards)

    // Thời gian bay / lơ lửng / quãng đường
    private Double maxFlightTimeMinutes;   // 51 phút
    private Double maxHoverTimeMinutes;    // 45 phút
    private Double maxFlightDistanceKm;    // 41 km

    // Khả năng chống gió tối đa (m/s)
    private Double maxWindResistanceMs;    // 12 m/s

    // Góc nghiêng tối đa (độ)
    private Double maxTiltAngleDeg;        // 35°

    // Nhiệt độ hoạt động (°C)
    private Integer minOperatingTempC;    // -10
    private Integer maxOperatingTempC;    // 40

    // Hệ thống định vị vệ tinh
    private String gnssSystems;           // "GPS + Galileo + BeiDou"

    // Độ chính xác khi lơ lửng (lưu text để show nguyên cụm)
    private String hoverAccuracyVertical;   // "±0.1m (vision), ±0.5m (GNSS)"
    private String hoverAccuracyHorizontal; // "±0.3m (vision), ±0.5m (GNSS)"

    // Bộ nhớ trong (mô tả cho các phiên bản)
    private String internalStorageOptions;  // "Mavic 4 Pro: 64GB (~42GB usable); 512GB (~460GB usable)"

    // Loại C2 (EU)
    private String euClassType;            // "C2"
}
