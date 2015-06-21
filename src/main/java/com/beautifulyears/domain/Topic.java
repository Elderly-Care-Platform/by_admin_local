package com.beautifulyears.domain;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

//The topic collection represents topics
@Document(collection = "topic")
public class Topic {

	@Id
	private String id;
	private String topicName;
	private String topicDesc;
	private String slug;
	private List<String> ancestors;
	private String parentId;
	private List<String> children = new ArrayList<String>();
	private int orderIdx;
	private Boolean isActive;
	
	
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getTopicName() {
		return topicName;
	}
	public void setTopicName(String topicName) {
		this.topicName = topicName;
	}
	public String getTopicDesc() {
		return topicDesc;
	}
	public void setTopicDesc(String topicDesc) {
		this.topicDesc = topicDesc;
	}
	public String getSlug() {
		return slug;
	}
	public void setSlug(String slug) {
		this.slug = slug;
	}
	public List<String> getAncestors() {
		return ancestors;
	}
	public void setAncestors(List<String> ancestors) {
		this.ancestors = ancestors;
	}
	public String getParentId() {
		return parentId;
	}
	public void setParentId(String parentId) {
		this.parentId = parentId;
	}
	public List<String> getChildren() {
		return children;
	}
	public void setChildren(List<String> children) {
		this.children = children;
	}
	public int getOrderIdx() {
		return orderIdx;
	}
	public void setOrderIdx(int orderIdx) {
		this.orderIdx = orderIdx;
	}
	public Boolean getIsActive() {
		return isActive;
	}
	public void setIsActive(Boolean isActive) {
		this.isActive = isActive;
	}
	
	
	
	
	
}
