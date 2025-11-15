package com.zosh.service;


import java.util.*;

import com.mysql.cj.x.protobuf.Mysqlx;
import com.zosh.domain.USER_ROLE;
import com.zosh.request.LoginRequest;
import com.zosh.request.RegisterUserRequest;
import com.zosh.response.RegisterUserResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.zosh.Exception.UserException;
import com.zosh.config.JwtProvider;
import com.zosh.model.User;
import com.zosh.repository.UserRepository;

@Service
public class UserServiceImplementation implements UserService {

	@Autowired
	private UserRepository userRepository;
	private JwtProvider jwtProvider;
	private PasswordEncoder passwordEncoder;
	private JavaMailSender javaMailSender;
	
	public UserServiceImplementation(
			UserRepository userRepository,
			JwtProvider jwtProvider,
			PasswordEncoder passwordEncoder,
			JavaMailSender javaMailSender) {
		
		this.userRepository=userRepository;
		this.jwtProvider=jwtProvider;
		this.passwordEncoder=passwordEncoder;
		this.javaMailSender=javaMailSender;
		
	}

	public User registerUser(RegisterUserRequest request) {
		if (userRepository.findByEmail(request.getEmail()).isPresent()) {
			throw new RuntimeException("Email đã được đăng ký.");
		}

		User user = new User();
		user.setEmail(request.getEmail());
		user.setPassword(passwordEncoder.encode(request.getPassword()));
		user.setRole(USER_ROLE.customer);

		return userRepository.save(user);
	}

	public User login(LoginRequest request) {
		Optional<User> user = userRepository.findByEmail(request.getEmail());
		if(user.isEmpty()) {
			throw new RuntimeException("invalid email or password");
		}
		if(!passwordEncoder.matches(request.getPassword(),user.get().getPassword())) {
			throw new RuntimeException("invalid email or password");
		}

		return user.get();
	}

	public User getProfile(Long id) {
		Optional<User> user = userRepository.findById(id);
		if(user.isEmpty()) {
			System.out.println("User is null for ID: " + id);
			throw new RuntimeException();
		}

		return user.get();
	}

//
//	@Override
//	public User findUserProfileByJwt(String jwt) throws UserException {
//		String email=jwtProvider.getEmailFromJwtToken(jwt);
//
//
//		User user = userRepository.findByEmail(email);
//
//		if(user==null) {
//			throw new UserException("user not exist with email "+email);
//		}
////		System.out.println("email user "+user.get().getEmail());
//		return user;
//	}
//
//	@Override
//	public List<User> findAllUsers() {
//		// TODO Auto-generated method stub
//		return userRepository.findAll();
//	}
//
//	@Override
//	public List<User> getPenddingRestaurantOwner() {
//
//		return userRepository.getPenddingRestaurantOwners();
//	}
//
//	@Override
//	public User findUserByEmail(String username) throws UserException {
//
//		User user=userRepository.findByEmail(username);
//
//		if(user!=null) {
//
//			return user;
//		}
//
//		throw new UserException("user not exist with username "+username);
//	}
//
//	@Override
//	public User updateUser(Long id, User user) {
//		User existinguser = userRepository.findById(id).orElseThrow();
//
//		existinguser.setPassword(passwordEncoder.encode(user.getPassword()));
//		existinguser.setFullName(user.getFullName());
//
//		userRepository.save(existinguser);
//
//		return existinguser;
//	}
}
