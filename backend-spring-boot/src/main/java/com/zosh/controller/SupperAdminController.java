package com.zosh.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.zosh.model.User;
import com.zosh.repository.UserRepository;
import com.zosh.service.UserService;

@RestController
public class SupperAdminController {
	
	@Autowired
	private UserService userService;

}
