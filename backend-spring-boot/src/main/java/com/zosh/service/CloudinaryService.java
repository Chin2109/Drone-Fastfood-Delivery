package com.zosh.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.zosh.domain.RestaurantRegisterImage;
import com.zosh.model.Restaurant;
import com.zosh.model.RestaurantImage;
import com.zosh.repository.RestaurantImageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Service
public class CloudinaryService {

    private final Cloudinary cloudinary;

    @Autowired
    private RestaurantImageRepository restaurantImageRepository;

    public CloudinaryService(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    /**
     * Upload ảnh lên Cloudinary
     * @param file   file nhận từ Multipart
     * @param folder tên folder trên Cloudinary (vd: "restaurants", "merchants")
     * @return secure_url của ảnh
     */
    public String uploadImage(MultipartFile file, String folder) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File upload is empty");
        }

        try {
            Map uploadResult = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap(
                            "folder", folder,
                            "resource_type", "image" // nếu sau này upload video/audio thì chỉnh lại
                    )
            );
            return (String) uploadResult.get("secure_url");
        } catch (IOException e) {
            throw new RuntimeException("Upload image to Cloudinary failed", e);
        }
    }

    public void saveImages(List<MultipartFile> files,
                            Restaurant restaurant,
                            RestaurantRegisterImage type) {
        if (files == null || files.isEmpty()) return;

        for (MultipartFile file : files) {
            if (file == null || file.isEmpty()) continue;

            String url = uploadImage(file, "restaurants");

            RestaurantImage img = new RestaurantImage();
            img.setRestaurant(restaurant);
            img.setUrl(url);
            img.setType(type);

            restaurantImageRepository.save(img);
        }
    }

}
