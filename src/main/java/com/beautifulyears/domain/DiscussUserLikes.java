package com.beautifulyears.domain;

import java.util.Date;

import org.springframework.data.mongodb.core.mapping.Document;

//The discuss_user_likes collection represents user likes on various discuss
@Document(collection = "discuss_user_likes")
public class DiscussUserLikes {

	String id;
	String userId;
	String discussId;
	String likedContentId; // can be a commentId or answerId
	String likedContentType;
	Date createdAt = new Date();

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public String getDiscussId() {
		return discussId;
	}

	public void setDiscussId(String discussId) {
		this.discussId = discussId;
	}

	public Date getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(Date createdAt) {
		this.createdAt = createdAt;
	}

	public String getLikedContentId() {
		return likedContentId;
	}

	public void setLikedContentId(String likedContentId) {
		this.likedContentId = likedContentId;
	}

	public String getLikedContentType() {
		return likedContentType;
	}

	public void setLikedContentType(String likedContentType) {
		this.likedContentType = likedContentType;
	}

	public DiscussUserLikes(String userId, String discussId, String likedContentId, String likedContentType) {
		super();
		this.userId = userId;
		this.discussId = discussId;
		this.likedContentId = likedContentId;
		this.likedContentType = likedContentType;
	}

}
