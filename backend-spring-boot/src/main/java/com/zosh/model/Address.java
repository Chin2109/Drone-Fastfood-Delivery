package com.zosh.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.locationtech.jts.geom.Point;


@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Address {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String fullName;

	@Column(columnDefinition = "POINT")
	@JsonIgnore //ẩn cấu trúc Point phức tạp của jts khỏi quá trình json hóa tự động
	//--> nó vẫn là kiểu dữ liệu Point, nhưng khi json hóa để giao tiếp, nó sẽ chỉ có dạng json lat và long
	private Point location;
	//dùng getter để jackson trả ra json
	public Double getLatitude() {
		return location != null ? location.getY() : null;
	}
	public Double getLongitude() {
		return location != null ? location.getX() : null;
	}
}
