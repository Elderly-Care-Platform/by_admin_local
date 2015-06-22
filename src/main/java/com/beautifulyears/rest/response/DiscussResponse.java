package com.beautifulyears.rest.response;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.beautifulyears.domain.Discuss;
import com.beautifulyears.domain.User;

public class DiscussResponse implements IResponse {

	
	private List<DiscussEntity> discussArray = new ArrayList<DiscussEntity>();
	
	@Override
	public List<DiscussEntity> getResponse() {
		// TODO Auto-generated method stub
		return this.discussArray;
	}

	public class DiscussEntity {
		private String id;
		private String title;
		private String articlePhotoFilename;
		private String userId;
		private String username;
		private String discussType; // Q, P and A (Question, Post and Article)
		private String text;
		private int aggrReplyCount;
		private Date createdAt = new Date();
		private List<String> topicId;
		private boolean isLikedByUser = false;
		private int aggrLikeCount = 0;

		public DiscussEntity(Discuss discuss, User user) {
			this.setId(discuss.getId());
			this.setTitle(discuss.getTitle());
			this.setArticlePhotoFilename(discuss.getArticlePhotoFilename());
			this.setUserId(discuss.getUserId());
			this.setUsername(discuss.getUsername());
			this.setDiscussType(discuss.getDiscussType());
			this.setText(discuss.getText());
			this.setAggrReplyCount(discuss.getAggrReplyCount());
			this.setCreatedAt(discuss.getCreatedAt());
			this.setTopicId(discuss.getTopicId());
			this.setAggrLikeCount(discuss.getLikedBy().size());
			if (null != user && discuss.getLikedBy().contains(user.getId())) {
				this.setLikedByUser(true);
			}
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

		public String getTitle() {
			return title;
		}

		public void setTitle(String title) {
			this.title = title;
		}

		public String getArticlePhotoFilename() {
			return articlePhotoFilename;
		}

		public void setArticlePhotoFilename(String articlePhotoFilename) {
			this.articlePhotoFilename = articlePhotoFilename;
		}

		public String getUserId() {
			return userId;
		}

		public void setUserId(String userId) {
			this.userId = userId;
		}

		public String getUsername() {
			return username;
		}

		public void setUsername(String username) {
			this.username = username;
		}

		public String getDiscussType() {
			return discussType;
		}

		public void setDiscussType(String discussType) {
			this.discussType = discussType;
		}

		public String getText() {
			return text;
		}

		public void setText(String text) {
			this.text = text;
		}

		public int getAggrReplyCount() {
			return aggrReplyCount;
		}

		public void setAggrReplyCount(int aggrReplyCount) {
			this.aggrReplyCount = aggrReplyCount;
		}

		public List<String> getTopicId() {
			return topicId;
		}

		public void setTopicId(List<String> topicId) {
			this.topicId = topicId;
		}

		public boolean isLikedByUser() {
			return isLikedByUser;
		}

		public void setLikedByUser(boolean isLikedByUser) {
			this.isLikedByUser = isLikedByUser;
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


	public void add(List<Discuss> discussArray) {
		for (Discuss discuss : discussArray) {
			this.discussArray.add(new DiscussEntity(discuss, null));
		}
	}

	public void add(Discuss discuss) {
		this.discussArray.add(new DiscussEntity(discuss, null));
	}
	
	public void add(List<Discuss> discussArray,User user) {
		for (Discuss discuss : discussArray) {
			this.discussArray.add(new DiscussEntity(discuss, user));
		}
	}

	public void add(Discuss discuss,User user) {
		this.discussArray.add(new DiscussEntity(discuss, user));
	}
	
	public DiscussEntity getDiscussEntity(Discuss discuss,User user){
		return new DiscussEntity(discuss, user);
	}

}
