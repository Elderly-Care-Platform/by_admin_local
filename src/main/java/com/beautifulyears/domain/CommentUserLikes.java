package com.beautifulyears.domain;

import java.util.Date;

import org.springframework.data.mongodb.core.mapping.Document;

//The comment_user_likes collection represents user likes on various comment
@Document(collection = "comment_user_likes")
public class CommentUserLikes {

	String id;
	String userId;
	String commentId;
	String is_like; // "0" or "1": 0 -> does not like, 1 -> likes
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

	public String getcommentId() {
		return commentId;
	}

	public void setcommentId(String commentId) {
		this.commentId = commentId;
	}

	public String getIs_like() {
		return is_like;
	}

	public void setIs_like(String is_like) {
		this.is_like = is_like;
	}

	public Date getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(Date createdAt) {
		this.createdAt = createdAt;
	}

	public CommentUserLikes() {

	}

	public CommentUserLikes(String userId, String commentId, String is_like,
			Date createdAt) {
		super();
		this.userId = userId;
		this.commentId = commentId;
		this.is_like = is_like;
		this.createdAt = createdAt;
	}

}
