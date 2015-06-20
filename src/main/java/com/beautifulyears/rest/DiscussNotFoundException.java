package com.beautifulyears.rest;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class DiscussNotFoundException extends RuntimeException {

    public DiscussNotFoundException(String discussId) {
        super(String.format("Discuss with id %s not found", discussId));
    }
}
