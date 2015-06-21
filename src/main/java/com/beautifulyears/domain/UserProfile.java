package com.beautifulyears.domain;

import java.util.Date;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "userprofiles")
public class UserProfile {

	@Id
	private String id;

	// Unique
	String userId;
	
	
	// values shoud be "0" or "1"
	String takeFamilyCare;
	String proElderlyCare;
	String volunteer;
	String business;
	String doNothing;

	private final Date createdAt = new Date();

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	

	public String getTakeFamilyCare() {
		return takeFamilyCare;
	}

	public void setTakeFamilyCare(String takeFamilyCare) {
		this.takeFamilyCare = takeFamilyCare;
	}

	public String getProElderlyCare() {
		return proElderlyCare;
	}

	public void setProElderlyCare(String proElderlyCare) {
		this.proElderlyCare = proElderlyCare;
	}

	public String getVolunteer() {
		return volunteer;
	}

	public void setVolunteer(String volunteer) {
		this.volunteer = volunteer;
	}

	public String getBusiness() {
		return business;
	}

	public void setBusiness(String business) {
		this.business = business;
	}

	public String getDoNothing() {
		return doNothing;
	}

	public void setDoNothing(String doNothing) {
		this.doNothing = doNothing;
	}

	public Date getCreatedAt() {
		return createdAt;
	}

	public UserProfile(String userId, String takeFamilyCare,
			String proElderlyCare, String volunteer, String business,
			String doNothing) {
		//super();
		this.userId = userId;
		this.takeFamilyCare = takeFamilyCare;
		this.proElderlyCare = proElderlyCare;
		this.volunteer = volunteer;
		this.business = business;
		this.doNothing = doNothing;
	}

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}
}
