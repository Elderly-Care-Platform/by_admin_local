/**
 * Jun 27, 2015
 * Nitin
 * 8:42:57 PM
 */
package com.beautifulyears.exceptions;

import org.springframework.http.HttpStatus;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonAutoDetect(creatorVisibility = JsonAutoDetect.Visibility.NONE, fieldVisibility = JsonAutoDetect.Visibility.NONE, getterVisibility = JsonAutoDetect.Visibility.NONE, isGetterVisibility = JsonAutoDetect.Visibility.NONE, setterVisibility = JsonAutoDetect.Visibility.NONE)
public class BYException extends RuntimeException {

	@JsonProperty
	private int errorCode;
	@JsonProperty
	private String errorMsg;
	@JsonIgnore
	private HttpStatus httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
	@JsonProperty
	private Object errorData;

	private static final long serialVersionUID = 1L;

	public BYException(BYErrorCodes byError) {
		this.errorCode = byError.getId();
		this.errorMsg = byError.getMsg();
	}

	public BYException(BYErrorCodes byError, HttpStatus httpStatus) {
		this.errorCode = byError.getId();
		this.errorMsg = byError.getMsg();
		if (null != httpStatus) {
			this.httpStatus = httpStatus;
		}
	}

	public BYException(BYErrorCodes byError, HttpStatus httpStatus,
			Object errorData) {
		this.errorCode = byError.getId();
		this.errorMsg = byError.getMsg();
		this.httpStatus = httpStatus;
		this.errorData = errorData;
	}

	public Object getErrorData() {
		return errorData;
	}

	public void setErrorData(Object errorData) {
		this.errorData = errorData;
	}

	public int getErrorCode() {
		return errorCode;
	}

	public void setErrorCode(int errorCode) {
		this.errorCode = errorCode;
	}

	public String getErrorMsg() {
		return errorMsg;
	}

	public void setErrorMsg(String errorMsg) {
		this.errorMsg = errorMsg;
	}

	public HttpStatus getHttpStatus() {
		return httpStatus;
	}

	public void setHttpStatus(HttpStatus httpStatus) {
		this.httpStatus = httpStatus;
	}

}
