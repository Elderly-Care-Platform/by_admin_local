/**
 * Jun 25, 2015
 * Nitin
 * 10:09:50 AM
 */
package com.beautifulyears.domain;

import java.util.Date;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

@Document(collection = "discuss_likes")
public class DiscussLike {

	@Id
	private String id;
	private String userId;
	private Date likedAt = new Date();
	private String contentId;
	private int contentType;
	@Transient
	private String url;

	public DiscussLike() {
		super();
	}

	public DiscussLike(User user, String contentId, int contentType) {
		this.userId = user.getId();
		this.contentId = contentId;
		this.contentType = contentType;
	}

	@JsonIgnore
	public String getUrl() {
		return url;
	}

	@JsonProperty
	public void setUrl(String url) {
		this.url = url;
	}

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

	public Date getLikedAt() {
		return likedAt;
	}

	public void setLikedAt(Date likedAt) {
		this.likedAt = likedAt;
	}

	public String getContentId() {
		return contentId;
	}

	public void setContentId(String contentId) {
		this.contentId = contentId;
	}

	public int getContentType() {
		return contentType;
	}

	public void setContentType(int contentType) {
		this.contentType = contentType;
	}

}
