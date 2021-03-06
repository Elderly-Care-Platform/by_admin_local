package com.beautifulyears.domain;

import java.util.Date;
import java.util.UUID;

import javax.servlet.http.HttpServletRequest;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.beautifulyears.constants.DiscussConstants;

@Document(collection = "session")
public class BySession {
	
	@Id
	private String sessionId = UUID.randomUUID().toString();
	private String userId;
	private String userName;
	private String userEmail;
	private Date createdAt = new Date();
	private int status = DiscussConstants.SESSION_STATUS_ACTIVE;
	private String ipAddress;
	
	

	public BySession() {
		super();
		// TODO Auto-generated constructor stub
	}



	public BySession(User user,HttpServletRequest req) {
		if(null != user){
			this.setUserId(user.getId());
			this.setUserEmail(user.getEmail());
			this.setUserName(user.getUserName());
		}
		String ipAddress = req.getHeader("X-FORWARDED-FOR");  
		   if (ipAddress == null) {  
			   ipAddress = req.getRemoteAddr();  
		   }
		this.setIpAddress(ipAddress);   
		
	}
	
	
	
	

	public String getIpAddress() {
		return ipAddress;
	}



	public void setIpAddress(String ipAddress) {
		this.ipAddress = ipAddress;
	}



	public String getUserName() {
		return userName;
	}



	public void setUserName(String userName) {
		this.userName = userName;
	}



	public String getUserEmail() {
		return userEmail;
	}



	public void setUserEmail(String userEmail) {
		this.userEmail = userEmail;
	}



	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public Date getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(Date createdAt) {
		this.createdAt = createdAt;
	}

	public String getSessionId() {
		return sessionId;
	}

	public void setSessionId(String sessionId) {
		this.sessionId = sessionId;
	}

	public int getStatus() {
		return status;
	}

	public void setStatus(int status) {
		this.status = status;
	}

}
