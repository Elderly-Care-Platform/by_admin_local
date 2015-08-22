package com.beautifulyears.rest;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class UserNotFoundException extends RuntimeException {

    /**
	 * 
	 */
	private static final long serialVersionUID = -6160549788599758954L;

	public UserNotFoundException(String userId) {
        super(String.format("User with id %s not found", userId));
    }
}
