package com.beautifulyears.domain;

import java.util.List;

public class EmailInfo {
	
	private List<String> emailIds;
	private String subject;
	private String body;
	private String senderName;
	
	public List<String> getEmailIds() {
		return emailIds;
	}
	public void setEmailIds(List<String> emailIds) {
		this.emailIds = emailIds;
	}
	public String getSubject() {
		return subject;
	}
	public void setSubject(String subject) {
		this.subject = subject;
	}
	public String getBody() {
		return body;
	}
	public void setBody(String body) {
		this.body = body;
	}
	
	public String getSenderName() {
		return senderName;
	}
	public void setSenderName(String senderName) {
		this.senderName = senderName;
	}
	
	@Override
	public String toString() {
		return "EmailInfo [emailIds=" + emailIds + ", subject=" + subject + ", body=" + body + ", senderName="
				+ senderName + "]";
	}
	
	
}