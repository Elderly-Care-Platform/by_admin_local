package com.beautifulyears.domain;

import java.util.Date;
import java.util.List;
import java.util.Map;

import org.springframework.data.mongodb.core.index.TextIndexed;
import org.springframework.data.mongodb.core.mapping.DBRef;

import com.beautifulyears.domain.menu.Menu;

public class IndividualProfileInfo {

	private String salutation;

	@TextIndexed
	private String lastName;

	private int gender; // 0: female, 1: male.

	private Date dob;

	private Map<String, Date> otherDates;

	private String occupation;// working, not working, retired, studying

	@TextIndexed
	private List<String> emotionalIssues;

	@TextIndexed
	@DBRef
	private List<Menu> medicalIssues;

	@TextIndexed
	private List<String> otherIssues;

	private String maritalStatus;

	private List<String> language;

	@TextIndexed
	@DBRef
	private List<Menu> hobbies;

	@TextIndexed
	private List<String> otherHobbies;

	@TextIndexed
	@DBRef
	private List<Menu> interests;

	@TextIndexed
	private List<String> otherInterests;

	public String getSalutation() {
		return salutation;
	}

	public void setSalutation(String salutation) {
		this.salutation = salutation;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public int getGender() {
		return gender;
	}

	public void setGender(int gender) {
		this.gender = gender;
	}

	public Date getDob() {
		return dob;
	}

	public void setDob(Date dob) {
		this.dob = dob;
	}

	public Map<String, Date> getOtherDates() {
		return otherDates;
	}

	public void setOtherDates(Map<String, Date> otherDates) {
		this.otherDates = otherDates;
	}

	public String getOccupation() {
		return occupation;
	}

	public void setOccupation(String occupation) {
		this.occupation = occupation;
	}

	public List<String> getEmotionalIssues() {
		return emotionalIssues;
	}

	public void setEmotionalIssues(List<String> emotionalIssues) {
		this.emotionalIssues = emotionalIssues;
	}

	public List<Menu> getMedicalIssues() {
		return medicalIssues;
	}

	public void setMedicalIssues(List<Menu> medicalIssues) {
		this.medicalIssues = medicalIssues;
	}

	public List<String> getOtherIssues() {
		return otherIssues;
	}

	public void setOtherIssues(List<String> otherIssues) {
		this.otherIssues = otherIssues;
	}

	public String getMaritalStatus() {
		return maritalStatus;
	}

	public void setMaritalStatus(String maritalStatus) {
		this.maritalStatus = maritalStatus;
	}

	public List<String> getLanguage() {
		return language;
	}

	public void setLanguage(List<String> language) {
		this.language = language;
	}

	public List<Menu> getHobbies() {
		return hobbies;
	}

	public void setHobbies(List<Menu> hobbies) {
		this.hobbies = hobbies;
	}

	public List<String> getOtherHobbies() {
		return otherHobbies;
	}

	public void setOtherHobbies(List<String> otherHobbies) {
		this.otherHobbies = otherHobbies;
	}

	public List<Menu> getInterests() {
		return interests;
	}

	public void setInterests(List<Menu> interests) {
		this.interests = interests;
	}

	public List<String> getOtherInterests() {
		return otherInterests;
	}

	public void setOtherInterests(List<String> otherInterests) {
		this.otherInterests = otherInterests;
	}

	@Override
	public String toString() {
		return "IndividualProfileInfo [salutation=" + salutation
				+ ", lastName=" + lastName + ", gender=" + gender + ", dob="
				+ dob + ", otherDates=" + otherDates + ", occupation="
				+ occupation + ", emotionalIssues=" + emotionalIssues
				+ ", medicalIssues=" + medicalIssues + ", otherIssues="
				+ otherIssues + ", maritalStatus=" + maritalStatus
				+ ", language=" + language + ", hobbies=" + hobbies
				+ ", otherHobbies=" + otherHobbies + ", interests=" + interests
				+ ", otherInterests=" + otherInterests + ", getSalutation()="
				+ getSalutation() + ", getLastName()=" + getLastName()
				+ ", getGender()=" + getGender() + ", getDob()=" + getDob()
				+ ", getOtherDates()=" + getOtherDates() + ", getOccupation()="
				+ getOccupation() + ", getEmotionalIssues()="
				+ getEmotionalIssues() + ", getMedicalIssues()="
				+ getMedicalIssues() + ", getOtherIssues()=" + getOtherIssues()
				+ ", getMaritalStatus()=" + getMaritalStatus()
				+ ", getLanguage()=" + getLanguage() + ", getHobbies()="
				+ getHobbies() + ", getOtherHobbies()=" + getOtherHobbies()
				+ ", getInterests()=" + getInterests()
				+ ", getOtherInterests()=" + getOtherInterests()
				+ ", getClass()=" + getClass() + ", hashCode()=" + hashCode()
				+ ", toString()=" + super.toString() + "]";
	}

}
