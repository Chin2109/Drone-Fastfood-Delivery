package com.zosh.service;

import java.util.List;

import com.zosh.Exception.UserException;
import com.zosh.model.User;

public interface UserService {

	public User findUserProfileByJwt(String jwt) throws UserException;
	
	public User findUserByEmail(String email) throws UserException;

	public List<User> findAllUsers();

	public List<User> getPenddingRestaurantOwner();

	public User updateUser(Long id, User user);

}
