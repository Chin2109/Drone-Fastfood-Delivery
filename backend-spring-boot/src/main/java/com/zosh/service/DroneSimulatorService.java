package com.zosh.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.zosh.model.Drone;
import com.zosh.model.Order;
import com.zosh.repository.DroneRepository;
import com.zosh.repository.OrderRepository;
import org.locationtech.jts.geom.Point;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.*;

@Service
public class DroneSimulatorService {

    private final SimpMessagingTemplate simpMessagingTemplate;
    private final OrderRepository orderRepository;
    private final DroneRepository droneRepository;
    private final ObjectMapper mapper = new ObjectMapper();

    // Control running simulations per order/drone
    private final Map<Long, Future<?>> runningSimulations = new ConcurrentHashMap<>();
    private final ScheduledExecutorService executor = Executors.newScheduledThreadPool(4);

    public DroneSimulatorService(SimpMessagingTemplate simpMessagingTemplate,
                                 OrderRepository orderRepository,
                                 DroneRepository droneRepository) {
        this.simpMessagingTemplate = simpMessagingTemplate;
        this.orderRepository = orderRepository;
        this.droneRepository = droneRepository;
    }

    /**
     * Start a simulation for orderId. durationSeconds default e.g. 120.
     * If a simulation for the same order is running, it will be ignored.
     */
    public void startSimulation(Long orderId, int durationSeconds) {
        if (runningSimulations.containsKey(orderId)) {
            // already running; ignore or optionally cancel+restart
            return;
        }

        Callable<Void> task = () -> {
            try {
                runSimulation(orderId, durationSeconds);
            } finally {
                runningSimulations.remove(orderId);
            }
            return null;
        };

        Future<?> f = executor.submit(task);
        runningSimulations.put(orderId, f);
    }

    public void stopSimulation(Long orderId) {
        Future<?> f = runningSimulations.remove(orderId);
        if (f != null) {
            f.cancel(true);
        }
    }

    private void runSimulation(Long orderId, int durationSeconds) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        Drone drone = order.getDrone();
        if (drone == null) throw new RuntimeException("Order has no drone");

        // gather points (assume Point stored in Address.location)
        Point hubPt = drone.getHub().getAddress().getLocation();
        Point restPt = order.getRestaurant().getAddress().getLocation();
        Point destPt = order.getDeliveryAddress().getLocation();

        // convert to lat/lng (JTS: X=lng, Y=lat)
        List<LatLng> path = new ArrayList<>();
        path.add(new LatLng(hubPt.getY(), hubPt.getX()));
        path.add(new LatLng(restPt.getY(), restPt.getX()));
        path.add(new LatLng(destPt.getY(), destPt.getX()));

        // split total seconds across legs proportional to distance
        List<Leg> legs = computeLegs(path, durationSeconds * 1000L);

        int seq = 0;

        // For each leg, publish positions every second (or finer)
        for (int i = 0; i < legs.size(); i++) {
            Leg leg = legs.get(i);
            long steps = Math.max(1, leg.durationMs / 1000L); // 1s tick
            for (int s = 1; s <= steps; s++) {
                if (Thread.currentThread().isInterrupted()) return;
                double t = (double) s / steps;
                double lat = lerp(leg.from.lat, leg.to.lat, t);
                double lng = lerp(leg.from.lng, leg.to.lng, t);

                seq++;
                publishPosition(drone.getId(), orderId, lat, lng, legStatus(i), seq);

                try {
                    Thread.sleep(1000L);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                    return;
                }
            }
        }

        // final arrived
        publishPosition(drone.getId(), orderId, destPt.getY(), destPt.getX(), "DELIVERED", ++seq);

        // optionally update DB statuses here (drone.status, order.status)
    }

    private String legStatus(int legIndex) {
        // 0: hub->restaurant, 1: restaurant->customer
        if (legIndex == 0) return "FLYING_TO_PICKUP";
        return "OUT_FOR_DELIVERY";
    }

    private void publishPosition(Long droneId, Long orderId, double lat, double lng, String status, int seq) {
        try {
            ObjectNode node = mapper.createObjectNode();
            node.put("droneId", droneId);
            node.put("orderId", orderId);
            node.put("lat", lat);
            node.put("lng", lng);
            node.put("status", status);
            node.put("seq", seq);
            node.put("useServer", true);
            node.put("ts", System.currentTimeMillis());

            String topic = "/topic/drone/" + orderId;
            simpMessagingTemplate.convertAndSend(topic, mapper.writeValueAsString(node));
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    // helpers

    private static class LatLng { double lat, lng; LatLng(double lat, double lng){ this.lat = lat; this.lng = lng; } }
    private static class Leg { LatLng from, to; long durationMs; Leg(LatLng f, LatLng t, long d){ this.from=f; this.to=t; this.durationMs=d; } }

    private List<Leg> computeLegs(List<LatLng> pts, long totalMs) {
        List<Leg> legs = new ArrayList<>();
        double totalKm = 0;
        double[] kms = new double[pts.size()-1];
        for (int i = 0; i < pts.size()-1; i++) {
            kms[i] = haversineKm(pts.get(i).lat, pts.get(i).lng, pts.get(i+1).lat, pts.get(i+1).lng);
            totalKm += kms[i];
        }
        for (int i = 0; i < kms.length; i++) {
            long dur = totalMs;
            if (totalKm > 0) dur = Math.max(500L, Math.round((kms[i] / totalKm) * totalMs));
            legs.add(new Leg(pts.get(i), pts.get(i+1), dur));
        }
        return legs;
    }

    private static double lerp(double a, double b, double t) { return a + (b - a) * t; }

    private static double haversineKm(double lat1, double lon1, double lat2, double lon2) {
        double R = 6371.0;
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat/2)*Math.sin(dLat/2)
                + Math.cos(Math.toRadians(lat1))*Math.cos(Math.toRadians(lat2))
                * Math.sin(dLon/2)*Math.sin(dLon/2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }
}

