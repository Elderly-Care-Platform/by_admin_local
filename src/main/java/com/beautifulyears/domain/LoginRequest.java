package com.beautifulyears.domain;

public class LoginRequest {
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

	public LoginRequest(User user) {
		// super();
		this.email = user.getEmail();
		this.password = user.getPassword();
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
