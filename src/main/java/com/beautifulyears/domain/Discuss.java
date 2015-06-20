package com.beautifulyears.domain;

import java.util.Date;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

//The discuss collection represents Articles, Questions and Posts
@Document(collection = "discuss")
public class Discuss {

	@Id
	private String id;

	private String title;
	
	private String articlePhotoFilename;

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	private String userId;
	
	private String username;

	private String discussType; // Q, P and A (Question, Post and Article)

	private String text;

	private String status; // published, unpublished

	private String tags;

	private int aggrReplyCount;

	private int aggrLikeCount;

	private final Date createdAt = new Date();
	
	private String topicId;
	
	private String subTopicId;
	
	private String featured;

	public Discuss() {

	}
	
	
	
	

	public String getFeatured() {
		return featured;
	}

	public void setFeatured(String featured) {
		this.featured = featured;
	}

	public String getArticlePhotoFilename() {
		return articlePhotoFilename;
	}

	public void setArticlePhotoFilename(String articlePhotoFilename) {
		this.articlePhotoFilename = articlePhotoFilename;
	}

	public String getTopicId() {
		return topicId;
	}

	public void setTopicId(String topicId) {
		this.topicId = topicId;
	}

	public String getSubTopicId() {
		return subTopicId;
	}

	public void setSubTopicId(String subTopicId) {
		this.subTopicId = subTopicId;
	}

	public Discuss(String userId, String username, String discussType, String topicId, String subTopicId, String title,
			String text, String status, String tags, int aggrReplyCount,
			int aggrLikeCount, String articlePhotoFilename, String featured) {
		super();
		this.userId = userId;
		this.username = username;
		this.discussType = discussType;
		this.title = title;
		this.topicId = topicId;
		this.subTopicId = subTopicId;
		this.text = text;
		this.status = status;
		this.tags = tags;
		this.aggrReplyCount = aggrReplyCount;
		this.aggrLikeCount = aggrLikeCount;
		this.articlePhotoFilename = articlePhotoFilename;
		this.featured = featured;
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

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
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

	public int getAggrLikeCount() {
		return aggrLikeCount;
	}

	public void setAggrLikeCount(int aggrLikeCount) {
		this.aggrLikeCount = aggrLikeCount;
	}

	public Date getCreatedAt() {
		return createdAt;
	}
}
