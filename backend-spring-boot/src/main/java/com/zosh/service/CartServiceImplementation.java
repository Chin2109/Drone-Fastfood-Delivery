package com.zosh.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.zosh.Exception.CartException;
import com.zosh.Exception.CartItemException;
import com.zosh.Exception.FoodException;
import com.zosh.Exception.UserException;
import com.zosh.model.Cart;
import com.zosh.model.CartItem;
import com.zosh.model.Food;
import com.zosh.model.User;
import com.zosh.repository.CartItemRepository;
import com.zosh.repository.CartRepository;
import com.zosh.request.AddCartItemRequest;
import com.zosh.request.UpdateCartItemRequest;

@Service
public class CartServiceImplementation implements CartSerive {
	@Autowired
	private CartRepository cartRepository;
	@Autowired
	private UserService userService;
	@Autowired
	private CartItemRepository cartItemRepository;

//	@Override
//	public CartItem addItemToCart(AddCartItemRequest req, String jwt) throws UserException, FoodException, CartException, CartItemException {
//
//		User user = userService.findUserProfileByJwt(jwt);
//
//		Optional<Food> menuItem=menuItemRepository.findById(req.getMenuItemId());
//		if(menuItem.isEmpty()) {
//			throw new FoodException("Menu Item not exist with id "+req.getMenuItemId());
//		}
//
//		Cart cart = findCartByUserId(user.getId());
//
//		for (CartItem cartItem : cart.getItems()) {
//			if (cartItem.getFood().equals(menuItem.get())) {
//
//				int newQuantity = cartItem.getQuantity() + req.getQuantity();
//				return updateCartItemQuantity(cartItem.getId(),newQuantity);
//			}
//		}
//
//		CartItem newCartItem = new CartItem();
//		newCartItem.setFood(menuItem.get());
//		newCartItem.setQuantity(req.getQuantity());
//		newCartItem.setCart(cart);
//		newCartItem.setIngredients(req.getIngredients());
//		newCartItem.setTotalPrice(req.getQuantity()*menuItem.get().getPrice());
//
//		CartItem savedItem=cartItemRepository.save(newCartItem);
//		cart.getItems().add(savedItem);
//		cartRepository.save(cart);
//
//		return savedItem;
//
//	}

}
