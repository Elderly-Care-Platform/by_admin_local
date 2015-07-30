package com.beautifulyears.domain;

import java.util.ArrayList;
import java.util.List;

public class IndividualProfileInfo {
	
	private String lastName; 
	
	private int sex;	 //0: female, 1: male.
	
	private List<String> issues = new ArrayList<String>();

	public IndividualProfileInfo() {
		
	}
	
	public IndividualProfileInfo(String lastName, int sex, List<String> issues) {
		super();
		this.lastName = lastName;
		this.sex = sex;
		this.issues = issues;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public int getSex() {
		return sex;
	}

	public void setSex(int sex) {
		this.sex = sex;
	}

	public List<String> getIssues() {
		return issues;
	}

	public void setIssues(List<String> issues) {
		this.issues = issues;
	}

	@Override
	public String toString() {
		return "IndividualProfileInfo [lastName=" + lastName + ", sex=" + sex
				+ ", issues=" + issues + "]";
	}
	
	

}
