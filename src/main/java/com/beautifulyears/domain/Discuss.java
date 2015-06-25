package com.beautifulyears.domain;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

//The discuss collection represents Articles, Questions and Posts
@Document(collection = "discuss")
public class Discuss {

	@Id
	private String id;

	private String title;

	private String articlePhotoFilename;

	private String userId;

	private String username;

	private String discussType; // Q, P and A (Question, Post and Article)

	private String text;

	private int status; // published, unpublished

	private String tags;

	private int aggrReplyCount;

	private final Date createdAt = new Date();

	private Date lastModifiedAt = new Date();

	private List<String> topicId;

	private List<String> likedBy = new ArrayList<String>();

	private boolean isFeatured;

	public Discuss() {

	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public Date getLastModifiedAt() {
		return lastModifiedAt;
	}

	public void setLastModifiedAt(Date lastModifiedAt) {
		this.lastModifiedAt = lastModifiedAt;
	}

	public boolean isFeatured() {
		return isFeatured;
	}

	public void setFeatured(boolean isFeatured) {
		this.isFeatured = isFeatured;
	}

	public List<String> getLikedBy() {
		return likedBy;
	}

	public void setLikedBy(List<String> likedBy) {
		this.likedBy = likedBy;
	}

	public String getArticlePhotoFilename() {
		return articlePhotoFilename;
	}

	public void setArticlePhotoFilename(String articlePhotoFilename) {
		this.articlePhotoFilename = articlePhotoFilename;
	}

	public List<String> getTopicId() {
		return topicId;
	}

	public void setTopicId(List<String> topicId) {
		this.topicId = topicId;
	}

	public Discuss(String userId, String username, String discussType,
			List<String> topicId, String title, String text, int status,
			String tags, int aggrReplyCount, String articlePhotoFilename,
			Boolean isFeatured) {
		super();
		this.userId = userId;
		this.username = username;
		this.discussType = discussType;
		this.title = title;
		this.topicId = topicId;
		this.text = text;
		this.status = status;
		this.tags = tags;
		this.aggrReplyCount = aggrReplyCount;
		this.articlePhotoFilename = articlePhotoFilename;
		this.isFeatured = isFeatured;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
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

	public String getDiscussType() {
		return discussType;
	}

	public void setDiscussType(String postType) {
		this.discussType = postType;
	}

	public String getText() {
		return text;
	}

	public void setText(String text) {
		this.text = text;
	}

	public int getStatus() {
		return status;
	}

	public void setStatus(int status) {
		this.status = status;
	}

	public String getTags() {
		return tags;
	}

	public void setTags(String tags) {
		this.tags = tags;
	}

	public int getAggrReplyCount() {
		return aggrReplyCount;
	}

	public void setAggrReplyCount(int aggrReplyCount) {
		this.aggrReplyCount = aggrReplyCount;
	}

	public Date getCreatedAt() {
		return createdAt;
	}
}
