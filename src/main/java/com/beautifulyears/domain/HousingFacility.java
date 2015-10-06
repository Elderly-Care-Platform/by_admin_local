/**
 * 
 */
package com.beautifulyears.domain;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.index.TextIndexed;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import com.beautifulyears.domain.menu.Tag;
import com.fasterxml.jackson.annotation.JsonIgnore;

/**
 * @author Nitin
 *
 */
@Document(collection = "housing_facility")
public class HousingFacility {

	@Id
	private String id;

	private String userId;

	@TextIndexed
	private String name;

	@DBRef
	private List<Tag> systemTags = new ArrayList<Tag>();

	private String tier;

	@TextIndexed
	private UserAddress primaryAddress = new UserAddress();

	private String primaryPhoneNo;
	private List<String> secondaryPhoneNos = new ArrayList<String>();

	private String primaryEmail;
	private List<String> secondaryEmails = new ArrayList<String>();

	private Map<String, String> profileImage;
	private List<Map<String, String>> photoGalleryURLs = new ArrayList<Map<String, String>>();

	private String shortDescription;
	@TextIndexed
	private String description;

	private List<String> categoriesId;

	private int status; // Unparroved, verified, etc.

	@JsonIgnore
	private List<String> reviewedBy = new ArrayList<String>();

	@JsonIgnore
	private List<String> ratedBy = new ArrayList<String>();

	private Float aggrRatingPercentage = 0f;

	@Transient
	private boolean isReviewedByUser = false;

	@Transient
	private boolean isRatedByUser = false;

	private boolean isFeatured;

	private String website;

	private Date createdAt = new Date();

	private Date lastModifiedAt = new Date();

	private boolean verified = false;

	public boolean isVerified() {
		return verified;
	}

	public void setVerified(boolean isVerified) {
		this.verified = isVerified;
	}

	public Date getLastModifiedAt() {
		return lastModifiedAt;
	}

	public void setLastModifiedAt(Date lastModifiedAt) {
		this.lastModifiedAt = lastModifiedAt;
	}

	public Date getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(Date createdAt) {
		this.createdAt = createdAt;
	}

	public List<String> getCategoriesId() {
		return categoriesId;
	}

	public void setCategoriesId(List<String> categoriesId) {
		this.categoriesId = categoriesId;
	}

	public String getWebsite() {
		return website;
	}

	public void setWebsite(String website) {
		this.website = website;
	}

	public boolean isFeatured() {
		return isFeatured;
	}

	public void setFeatured(boolean isFeatured) {
		this.isFeatured = isFeatured;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public UserAddress getPrimaryAddress() {
		return primaryAddress;
	}

	public void setPrimaryAddress(UserAddress primaryAddress) {
		this.primaryAddress = primaryAddress;
	}

	public String getPrimaryPhoneNo() {
		return primaryPhoneNo;
	}

	public void setPrimaryPhoneNo(String primaryPhoneNo) {
		this.primaryPhoneNo = primaryPhoneNo;
	}

	public List<String> getSecondaryPhoneNos() {
		return secondaryPhoneNos;
	}

	public void setSecondaryPhoneNos(List<String> secondaryPhoneNos) {
		this.secondaryPhoneNos = secondaryPhoneNos;
	}

	public String getPrimaryEmail() {
		return primaryEmail;
	}

	public void setPrimaryEmail(String primaryEmail) {
		this.primaryEmail = primaryEmail;
	}

	public List<String> getSecondaryEmails() {
		return secondaryEmails;
	}

	public void setSecondaryEmails(List<String> secondaryEmails) {
		this.secondaryEmails = secondaryEmails;
	}

	public Map<String, String> getProfileImage() {
		return profileImage;
	}

	public void setProfileImage(Map<String, String> profileImage) {
		this.profileImage = profileImage;
	}

	public List<Map<String, String>> getPhotoGalleryURLs() {
		return photoGalleryURLs;
	}

	public void setPhotoGalleryURLs(List<Map<String, String>> photoGalleryURLs) {
		this.photoGalleryURLs = photoGalleryURLs;
	}

	public String getShortDescription() {
		return shortDescription;
	}

	public void setShortDescription(String shortDescription) {
		this.shortDescription = shortDescription;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public List<Tag> getSystemTags() {
		return systemTags;
	}

	public void setSystemTags(List<Tag> systemTags) {
		this.systemTags = systemTags;
	}

	public String getTier() {
		return tier;
	}

	public void setTier(String tier) {
		this.tier = tier;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public int getStatus() {
		return status;
	}

	public void setStatus(int status) {
		this.status = status;
	}

	public List<String> getReviewedBy() {
		return reviewedBy;
	}

	public void setReviewedBy(List<String> reviewedBy) {
		this.reviewedBy = reviewedBy;
	}

	public List<String> getRatedBy() {
		return ratedBy;
	}

	public void setRatedBy(List<String> ratedBy) {
		this.ratedBy = ratedBy;
	}

	public Float getAggrRatingPercentage() {
		return aggrRatingPercentage;
	}

	public void setAggrRatingPercentage(Float aggrRatingPercentage) {
		this.aggrRatingPercentage = aggrRatingPercentage;
	}

	public boolean isReviewedByUser() {
		return isReviewedByUser;
	}

	public void setReviewedByUser(boolean isReviewedByUser) {
		this.isReviewedByUser = isReviewedByUser;
	}

	public boolean isRatedByUser() {
		return isRatedByUser;
	}

	public void setRatedByUser(boolean isRatedByUser) {
		this.isRatedByUser = isRatedByUser;
	}

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	@Override
	public boolean equals(Object object) {
		boolean isEqual = false;

		if (object != null && object instanceof HousingFacility) {
			isEqual = this.getId() != null
					&& (this.getId().equals(((HousingFacility) object).getId()));
		}
		return isEqual;
	}

	@Override
	public int hashCode() {
		assert false : "hashCode not designed";
		return 42;
	}

}
