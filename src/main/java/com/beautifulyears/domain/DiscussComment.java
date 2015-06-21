package com.beautifulyears.domain;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.codehaus.jackson.annotate.JsonIgnore;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.codehaus.jackson.annotate.JsonProperty;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.mapping.Document;

//The discuss_comment collection represents comments
@Document(collection = "discuss_comment")
@JsonIgnoreProperties(ignoreUnknown = true)
public class DiscussComment {
	@Id
	private String id;
	private String discussId;
	private String userId;
	private String parentId;
	private String ancestorId;
	private String discussCommentTitle;
	private String discussCommenContent;
	private String userName;

	// the following cannot be SET by CLIENT JR TBD - Update @JsonIgnore
	private Date createdAt = new Date();
	private int ancestorOffset;
	private int descendentCount;
	private int siblingPosition;
	private int discussCommentLikeCount = 0;
	private int discussCommentCommentCount;

	@Transient
	private List<DiscussComment> children = new ArrayList<DiscussComment>();

	public DiscussComment() {
	}

	public DiscussComment(String discussId, String userId, String parentId,
			String ancestorId, String discussCommentTitle,
			String discussCommenContent, Date createdAt, int ancestorOffset,
			int descendentCount, int siblingPosition,
			int discussCommentLikeCount, int discussCommentCommentCount,
			String topicId, String subTopicId) {
		super();
		this.discussId = discussId;
		this.userId = userId;
		this.parentId = parentId;
		this.ancestorId = ancestorId;
		this.discussCommentTitle = discussCommentTitle;
		this.discussCommenContent = discussCommenContent;
		this.createdAt = createdAt;
		this.ancestorOffset = ancestorOffset;
		this.descendentCount = descendentCount;
		this.siblingPosition = siblingPosition;
		this.discussCommentLikeCount = discussCommentLikeCount;
		this.discussCommentCommentCount = discussCommentCommentCount;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getDiscussId() {
		return discussId;
	}

	public void setDiscussId(String discussId) {
		this.discussId = discussId;
	}

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public String getParentId() {
		return parentId;
	}

	public void setParentId(String parentId) {
		this.parentId = parentId;
	}

	public String getAncestorId() {
		return ancestorId;
	}

	public void setAncestorId(String ancestorId) {
		this.ancestorId = ancestorId;
	}

	public int getDescendentCount() {
		return descendentCount;
	}

	public void setDescendentCount(int descendentCount) {
		this.descendentCount = descendentCount;
	}

	public int getAncestorOffset() {
		return ancestorOffset;
	}

	public void setAncestorOffset(int ancestorOffset) {
		this.ancestorOffset = ancestorOffset;
	}

	public int getSiblingPosition() {
		return siblingPosition;
	}

	public void setSiblingPosition(int siblingPosition) {
		this.siblingPosition = siblingPosition;
	}

	public String getDiscussCommentTitle() {
		return discussCommentTitle;
	}

	public void setDiscussCommentTitle(String discussCommentTitle) {
		this.discussCommentTitle = discussCommentTitle;
	}

	public String getDiscussCommenContent() {
		return discussCommenContent;
	}

	public void setDiscussCommenContent(String discussCommenContent) {
		this.discussCommenContent = discussCommenContent;
	}

	public int getDiscussCommentLikeCount() {
		return discussCommentLikeCount;
	}

	public void setDiscussCommentLikeCount(int discussCommentLikeCount) {
		this.discussCommentLikeCount = discussCommentLikeCount;
	}

	public int getDiscussCommentCommentCount() {
		return discussCommentCommentCount;
	}

	public void setDiscussCommentCommentCount(int discussCommentCommentCount) {
		this.discussCommentCommentCount = discussCommentCommentCount;
	}

	public Date getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(Date createdAt) {
		this.createdAt = createdAt;
	}

	public List<DiscussComment> getChildren() {
		return children;
	}

	public void setChildren(List<DiscussComment> children) {
		this.children = children;
	}

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

}
