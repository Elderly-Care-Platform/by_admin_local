/**
 * 
 */
package com.beautifulyears.domain;

import java.util.Date;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

/**
 * @author Nitin
 *
 */

@Document(collection = "activityLogs")
@JsonIgnoreProperties(ignoreUnknown = true)
public class ActivityLog {

	@Id
	private String id;
	private Date activityTime;
	private int activityType;
	private String userId;
	private String currentUserEmailId;
	private boolean isRead;
	private String entityId;
	private int crudType;
	private String details;
	private String titleToDisplay;

	public String getCurrentUserEmailId() {
		return currentUserEmailId;
	}

	public void setCurrentUserEmailId(String currentUserEmailId) {
		this.currentUserEmailId = currentUserEmailId;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public Date getActivityTime() {
		return activityTime;
	}

	public void setActivityTime(Date activityTime) {
		this.activityTime = activityTime;
	}

	public int getActivityType() {
		return activityType;
	}

	public void setActivityType(int activityType) {
		this.activityType = activityType;
	}

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public boolean isRead() {
		return isRead;
	}

	public void setRead(boolean isRead) {
		this.isRead = isRead;
	}

	public String getEntityId() {
		return entityId;
	}

	public void setEntityId(String entityId) {
		this.entityId = entityId;
	}

	public int getCrudType() {
		return crudType;
	}

	public void setCrudType(int crudType) {
		this.crudType = crudType;
	}

	public String getDetails() {
		return details;
	}

	public void setDetails(String details) {
		this.details = details;
	}

	public String getTitleToDisplay() {
		return titleToDisplay;
	}

	public void setTitleToDisplay(String titleToDisplay) {
		this.titleToDisplay = titleToDisplay;
	}

}
