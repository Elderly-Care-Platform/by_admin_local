/**
 * 
 */
package com.beautifulyears.exceptions;

import org.apache.log4j.Logger;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import com.beautifulyears.rest.response.BYGenericResponseHandler;

/**
 * @author Nitin
 *
 */
@ControllerAdvice
public class BYExceptionHandler extends ResponseEntityExceptionHandler{
	
	private Logger logger = Logger.getLogger(ResponseEntityExceptionHandler.class);
	
	@ExceptionHandler(BYException.class)
	public ResponseEntity<Object> handleCustomException(BYException e, WebRequest request) {
 
		logger.error("exception ocurred "+e.getErrorCode() + " msg: "+e.getErrorMsg());
		
		
		HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        
        return BYGenericResponseHandler.getResponse(e);
//		return handleExceptionInternal(e, e, headers, HttpStatus.UNPROCESSABLE_ENTITY, request);
 
	}
}
