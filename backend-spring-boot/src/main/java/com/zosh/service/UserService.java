package com.zosh.service;

import java.util.List;

import com.zosh.Exception.UserException;
import com.zosh.model.User;
import com.zosh.request.LoginRequest;
import com.zosh.request.RegisterUserRequest;
import com.zosh.response.RegisterUserResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface UserService {
	public User registerUser(RegisterUserRequest request);

	public User login(LoginRequest request);

	public User getProfile(Long id);

	public List<User> getAll();

	Page<User> searchUsers(String keyword, String status, Pageable pageable);

//
//	public User findUserProfileByJwt(String jwt) throws UserException;
//
//	public User findUserByEmail(String email) throws UserException;
//
//	public List<User> findAllUsers();
//
//	public List<User> getPenddingRestaurantOwner();
//
//	public User updateUser(Long id, User user);

}
