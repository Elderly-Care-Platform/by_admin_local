package com.beautifulyears.domain;

public class LoginRequest {
	private int regType;
	private String phoneNumber;
	private String email;
	private String password;

	public LoginRequest() {
		super();
	}

	public LoginRequest(String email, String password) {
		super();
		this.email = email;
		this.password = password;
	}

	public int getRegType() {
		return regType;
	}

	public void setRegType(int regType) {
		this.regType = regType;
	}

	public String getPhoneNumber() {
		return phoneNumber;
	}

	public void setPhoneNumber(String phoneNumber) {
		this.phoneNumber = phoneNumber;
	}

	public LoginRequest(User user) {
		// super();
		this.email = user.getEmail();
		this.password = user.getPassword();
		this.regType = user.getRegType();
		this.phoneNumber = user.getPhoneNumber();
	}

	public String getEmail() {
		return email.toLowerCase();
	}

	public void setEmail(String email) {
		this.email = email.toLowerCase();
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}
}
