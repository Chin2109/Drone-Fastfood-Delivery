package com.zosh.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

    @Entity
    @AllArgsConstructor
    @NoArgsConstructor
    @Data
    public class DroneHub {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        @OneToOne
        @JoinColumn(name = "address_id", nullable = false)
        private Address address;

        @OneToMany(mappedBy = "hub")
        private List<Drone> droneList;
    }
