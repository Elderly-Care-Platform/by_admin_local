/**
 * 
 */
package com.beautifulyears.rest.response;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import com.beautifulyears.exceptions.BYException;
import com.fasterxml.jackson.annotation.JsonIgnore;

/**
 * @author Nitin
 *
 */
public class BYGenericResponseHandler {
	@SuppressWarnings("unused")
	private static class ByGenericResponse{
		private int statusCode;
		private Object data;
		private RuntimeException error;
		@JsonIgnore
		private HttpStatus httpStatus = HttpStatus.OK;
		
		public HttpStatus getHttpStatus() {
			return httpStatus;
		}

		public ByGenericResponse(Object e) {
			if(e instanceof BYException){
				httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
				statusCode = ((BYException)e).getHttpStatus().value();
				data = null;
				error = (BYException)e;
			}else{
				statusCode = HttpStatus.OK.value();
				data = e;
				error = null;
			}
			
		}

		public int getStatusCode() {
			return statusCode;
		}

		public Object getData() {
			return data;
		}

		public RuntimeException getError() {
			return error;
		}

	}
	
	public static ResponseEntity<Object> getResponse(Object res){
		ByGenericResponse responseObj = new ByGenericResponse(res);
		HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
		return new ResponseEntity<Object>(responseObj, headers, responseObj.getHttpStatus());
	}

}
