package com.zosh.controller;

import com.zosh.config.JwtProvider;
import com.zosh.request.RegisterUserRequest;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.zosh.Exception.UserException;
import com.zosh.model.User;
import com.zosh.service.UserService;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/user")
public class UserController {
	@Autowired
	private UserService userService;

	@Autowired
	private JwtProvider jwtProvider;

	@PostMapping("/register")
	public ResponseEntity<?> createUserHandler(@RequestBody RegisterUserRequest request) {
		User savedUser= userService.registerUser(request);

		List<GrantedAuthority> authorities=new ArrayList<>();
		authorities.add(new SimpleGrantedAuthority(savedUser.getRole().toString()));
		Authentication authentication = new UsernamePasswordAuthenticationToken(savedUser.getEmail(),savedUser.getPassword(),authorities);
		SecurityContextHolder.getContext().setAuthentication(authentication);
		String token = jwtProvider.generateToken(authentication);

		return new ResponseEntity<>(Map.of(
				"message", "Đăng ký thành công",
				"token", token,
				"user", Map.of(
						"email", savedUser.getEmail(),
						"role", savedUser.getRole()
				)
		), HttpStatus.CREATED);
	}

	@GetMapping("/get-profile/{id}")
	public ResponseEntity<?> getProfile(@PathVariable("id") Long id) {
		log.info("Received request for user profile with ID: {}", id);
		User user = userService.getProfile(id);

		Map<String, Object> data = new HashMap<>();
		data.put("id", user.getId());
		data.put("email", user.getEmail());
		data.put("phone", null); // OK
		data.put("isActive", true);
		data.put("roles", List.of(user.getRole()));

		return ResponseEntity.status(HttpStatus.CREATED).body(
				Map.of(
						"message", "Taken successfully",
						"data", data
				)
		);
	}



}
