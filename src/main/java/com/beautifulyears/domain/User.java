package com.beautifulyears.domain;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "users")
public class User {
	
	@Id
	private String id;
	
	//Unique
	String userName;
	String password;
	
	//Unique
	String email;
	private final Date createdAt = new Date();
	private final String verificationCode = UUID.randomUUID().toString();
	Date verificationCodeExpiry = setCodeExpiryDate(new Date(), 15);
	String socialSignOnId;
	String socialSignOnPlatform;
	String passwordCode;
	Date passwordCodeExpiry;
	String userRoleId;
	String isActive;
	List<Integer> permissions = new ArrayList<Integer>();
	
	
	public String getIsActive() {
		return isActive;
	}


	public void setIsActive(String isActive) {
		this.isActive = isActive;
	}


	public List<Integer> getPermissions() {
		return permissions;
	}


	public void setPermissions(List<Integer> permissions) {
		this.permissions = permissions;
	}


	private Date setCodeExpiryDate(Date now, int daysToExpire)
	{
		now.setTime(now.getTime() + daysToExpire * 1000 * 60 * 60 * 24);
        return now;
	}
	
	
	public String isActive() {
		return isActive;
	}

	public void setActive(String isActive) {
		this.isActive = isActive;
	}

	public User()
	{
		
	}
	
	public User(String userName, String password, String email,
			String verificationCode, Date verificationCodeExpiry,
			String socialSignOnId, String socialSignOnPlatform,
			String passwordCode, Date passwordCodeExpiry,
			String userRoleId, String isActive) {
		super();
		this.userName = userName;
		this.password = password;
		this.email = email;
		//this.verificationCode = verificationCode;
		this.verificationCodeExpiry = verificationCodeExpiry;
		this.socialSignOnId = socialSignOnId;
		this.socialSignOnPlatform = socialSignOnPlatform;
		this.passwordCode = passwordCode;
		this.passwordCodeExpiry = passwordCodeExpiry;
		this.userRoleId = userRoleId;
		this.isActive = isActive;
		this.permissions = UserRolePermissions.getInstance().getUserPermsForRole(userRoleId);
	}
	
	
	public Date getCreatedAt() {
		return createdAt;
	}

	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getUserName() {
		return userName;
	}
	public void setUserName(String userName) {
		this.userName = userName;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getVerificationCode() {
		return verificationCode;
	}
	
	public Date getVerificationCodeExpiry() {
		return verificationCodeExpiry;
	}
	public void setVerificationCodeExpiry(Date verificationCodeExpiry) {
		this.verificationCodeExpiry = verificationCodeExpiry;
	}
	public String getSocialSignOnId() {
		return socialSignOnId;
	}
	public void setSocialSignOnId(String socialSignOnId) {
		this.socialSignOnId = socialSignOnId;
	}
	public String getSocialSignOnPlatform() {
		return socialSignOnPlatform;
	}
	public void setSocialSignOnPlatform(String socialSignOnPlatform) {
		this.socialSignOnPlatform = socialSignOnPlatform;
	}
	public String getPasswordCode() {
		return passwordCode;
	}
	public void setPasswordCode(String passwordCode) {
		this.passwordCode = passwordCode;
	}
	public Date getPasswordCodeExpiry() {
		return passwordCodeExpiry;
	}
	public void setPasswordCodeExpiry(Date passwordCodeExpiry) {
		this.passwordCodeExpiry = passwordCodeExpiry;
	}
	public String getUserRoleId() {
		return userRoleId;
	}
	public void setUserRoleId(String userRoleId) {
		this.userRoleId = userRoleId;
		this.permissions = UserRolePermissions.getInstance().getUserPermsForRole(userRoleId);
		
	}
}
