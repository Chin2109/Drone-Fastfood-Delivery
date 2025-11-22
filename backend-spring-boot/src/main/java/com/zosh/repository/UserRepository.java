package com.zosh.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.zosh.model.User;
import org.springframework.data.repository.query.Param;

public interface UserRepository extends JpaRepository<User, Long> {
	@Query("SELECT u FROM User u Where u.status='PENDING'")
	public List<User> getPenddingRestaurantOwners();
	
	public Optional<User> findByEmail(String email);

	public Optional<User> findById(Long id);

	@Query("""
        SELECT u FROM User u
        WHERE 
          (:keyword IS NULL OR :keyword = '' 
             OR LOWER(u.fullName) LIKE LOWER(CONCAT('%', :keyword, '%'))
             OR LOWER(u.email) LIKE LOWER(CONCAT('%', :keyword, '%')))
          AND (:status IS NULL OR :status = '' OR u.status = :status)
        """)
	Page<User> searchUsers(
			@Param("keyword") String keyword,
			@Param("status") String status,
			Pageable pageable
	);
}
