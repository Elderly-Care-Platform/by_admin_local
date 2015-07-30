/**
 * 
 */
package com.beautifulyears.domain;

import java.util.Date;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * @author Nitin
 *
 */
@Document(collection = "user_rating")
public class UserRating {
	@Id
	private String id;
	private Float ratingPercentage = 0f;
	private String userId;
	private String userName;
	private Integer associatedContentType;
	private String associatedId;
	private Date createdAt = new Date();

	
	public Date getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(Date createdAt) {
		this.createdAt = createdAt;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public Float getRatingPercentage() {
		return ratingPercentage;
	}

	public void setRatingPercentage(Float ratingPercentage) {
		this.ratingPercentage = ratingPercentage;
	}

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public Integer getAssociatedContentType() {
		return associatedContentType;
	}

	public void setAssociatedContentType(Integer associatedContentType) {
		this.associatedContentType = associatedContentType;
	}

	public String getAssociatedId() {
		return associatedId;
	}

	public void setAssociatedId(String associatedId) {
		this.associatedId = associatedId;
	}

}
