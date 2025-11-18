package com.zosh.service;

import com.zosh.Exception.CartException;
import com.zosh.Exception.CartItemException;
import com.zosh.Exception.FoodException;
import com.zosh.Exception.UserException;
import com.zosh.dto.CheckoutCalculateDto;
import com.zosh.model.Cart;
import com.zosh.model.CartItem;
import com.zosh.model.Food;
import com.zosh.model.User;
import com.zosh.request.AddCartItemRequest;
import com.zosh.request.CartPreviewRequest;
import com.zosh.request.CreateCartItemRequest;
import com.zosh.request.UpdateCartItemRequest;
import com.zosh.response.AddToCartResult;
import com.zosh.response.CartPreviewResponse;
import com.zosh.response.CartSummaryResponse;
import com.zosh.response.CheckoutCalculateResponse;

public interface CartSerive {

//	public CartItem addItemToCart(AddCartItemRequest req, String jwt) throws UserException, FoodException, CartException, CartItemException;

    AddToCartResult addToCart(CreateCartItemRequest request, Long userId, Long merchantId);

    CartSummaryResponse getCartItems(Long userId, Long merchantId);

    CartPreviewResponse cartPreview(Long userId, Long merchantId, CartPreviewRequest request);

    CheckoutCalculateResponse checkoutCalculate(Long userId,
                                                Long merchantId,
                                                CheckoutCalculateDto dto);

    void removeCartItem(Long userId, Long merchantId, Long cartItemId);


}
