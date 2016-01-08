/**
 * 
 */
package com.beautifulyears.domain.menu;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.TextIndexed;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

/**
 * @author Nitin
 *
 */
@Document(collection = "menu")
@JsonIgnoreProperties(ignoreUnknown = true)
public class Menu {
	@Id
	private String id;
	@DBRef
	private List<Tag> tags = new ArrayList<Tag>();
	private Integer module;
	private String linkedMenuId;
	@TextIndexed
	private String displayMenuName;
	private List<String> ancestorIds = new ArrayList<String>();
	private String parentMenuId;
	private String slug;
	private Boolean isHidden = false;
	private int orderIdx;

	@DBRef
	private List<Menu> children = new ArrayList<Menu>();
	private String filterName;

	public int getOrderIdx() {
		return orderIdx;
	}

	public void setOrderIdx(int orderIdx) {
		this.orderIdx = orderIdx;
	}

	public Boolean isHidden() {
		return isHidden;
	}

	public void setHidden(Boolean isHidden) {
		this.isHidden = isHidden;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public List<String> getAncestorIds() {
		return ancestorIds;
	}

	public void setAncestorIds(List<String> ancestorIds) {
		this.ancestorIds = ancestorIds;
	}

	public String getParentMenuId() {
		return parentMenuId;
	}

	public void setParentMenuId(String parentMenuId) {
		this.parentMenuId = parentMenuId;
	}

	public String getFilterName() {
		return filterName;
	}

	public void setFilterName(String filterName) {
		this.filterName = filterName;
	}

	public List<Tag> getTags() {
		return tags;
	}

	public void setTags(List<Tag> tags) {
		this.tags = tags;
	}

	public Integer getModule() {
		return module;
	}

	public void setModule(Integer module) {
		this.module = module;
	}

	public String getDisplayMenuName() {
		return displayMenuName;
	}

	public void setDisplayMenuName(String displayMenuName) {
		this.displayMenuName = displayMenuName;
	}

	public List<Menu> getChildren() {
		return children;
	}

	public void setChildren(List<Menu> children) {
		this.children = children;
	}

	public String getLinkedMenuId() {
		return linkedMenuId;
	}

	public void setLinkedMenuId(String linkedMenuId) {
		this.linkedMenuId = linkedMenuId;
	}

	public String getSlug() {
		return slug;
	}

	public void setSlug(String slug) {
		this.slug = slug;
	}

	@Override
	public boolean equals(Object object) {
		boolean isEqual = false;

		if (object != null && object instanceof Menu) {
			isEqual = (this.getId().equals(((Menu) object).getId()));
		}
		return isEqual;
	}

	@Override
	public int hashCode() {
		return 33;
	}

}
