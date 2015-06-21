package com.beautifulyears.domain;

import java.util.Date;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "user_dependents")
public class UserDependents {

	@Id
	private String id;

	// care taker's id
	String userId;

	String takingCareOf;
	String name;
	String livesWith;
	String livesIn;
	public String getLivesIn() {
		return livesIn;
	}

	public void setLivesIn(String livesIn) {
		this.livesIn = livesIn;
	}

	String maritalStatus;
	String impDate1;
	String impEvent1;
	String impDate2;
	String impEvent2;
	String impDate3;
	String impEvent3;
	String impDate4;
	String impEvent4;
	String impDate5;
	String impEvent5;

	String country;

	String city;

	String locality;

	String address;

	String emailId1;
	String emailId2;
	String emailId3;
	String emailId4;
	String emailId5;

	String phone1;
	String phone2;
	String phone3;
	String phone4;
	String phone5;

	String speaksLang;

	String interestedIn;

	String likesDoing;

	String sufferingFrom;

	// yes/no
	String shareSufferingFrom;

	String blurb;

	String imageUrl1;
	String imageUrl2;
	String imageUrl3;

	private final Date createdAt = new Date();

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public Date getCreatedAt() {
		return createdAt;
	}

	public UserDependents(String userId) {
		this.userId = userId;
	}

	public UserDependents() {

	}

	public UserDependents(String userId, String takingCareOf, String name,
			String livesWith, String maritalStatus, String impDate1,
			String impEvent1, String impDate2, String impEvent2,
			String impDate3, String impEvent3, String impDate4,
			String impEvent4, String impDate5, String impEvent5,
			String country, String city, String locality, String address,
			String emailId1, String emailId2, String emailId3, String emailId4,
			String emailId5, String phone1, String phone2, String phone3,
			String phone4, String phone5, String speaksLang,
			String interestedIn, String likesDoing, String sufferingFrom,
			String shareSufferingFrom, String blurb, String imageUrl1,
			String imageUrl2, String imageUrl3) {

		this.userId = userId;
		this.takingCareOf = takingCareOf;
		this.name = name;
		this.livesWith = livesWith;
		this.maritalStatus = maritalStatus;
		this.impDate1 = impDate1;
		this.impEvent1 = impEvent1;
		this.impDate2 = impDate2;
		this.impEvent2 = impEvent2;
		this.impDate3 = impDate3;
		this.impEvent3 = impEvent3;
		this.impDate4 = impDate4;
		this.impEvent4 = impEvent4;
		this.impDate5 = impDate5;
		this.impEvent5 = impEvent5;
		this.country = country;
		this.city = city;
		this.locality = locality;
		this.address = address;
		this.emailId1 = emailId1;
		this.emailId2 = emailId2;
		this.emailId3 = emailId3;
		this.emailId4 = emailId4;
		this.emailId5 = emailId5;
		this.phone1 = phone1;
		this.phone2 = phone2;
		this.phone3 = phone3;
		this.phone4 = phone4;
		this.phone5 = phone5;
		this.speaksLang = speaksLang;
		this.interestedIn = interestedIn;
		this.likesDoing = likesDoing;
		this.sufferingFrom = sufferingFrom;
		this.shareSufferingFrom = shareSufferingFrom;
		this.blurb = blurb;
		this.imageUrl1 = imageUrl1;
		this.imageUrl2 = imageUrl2;
		this.imageUrl3 = imageUrl3;
	}

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public String getTakingCareOf() {
		return takingCareOf;
	}

	public void setTakingCareOf(String takingCareOf) {
		this.takingCareOf = takingCareOf;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getLivesWith() {
		return livesWith;
	}

	public void setLivesWith(String livesWith) {
		this.livesWith = livesWith;
	}

	public String getMaritalStatus() {
		return maritalStatus;
	}

	public void setMaritalStatus(String maritalStatus) {
		this.maritalStatus = maritalStatus;
	}

	public String getImpDate1() {
		return impDate1;
	}

	public void setImpDate1(String impDate1) {
		this.impDate1 = impDate1;
	}

	public String getImpEvent1() {
		return impEvent1;
	}

	public void setImpEvent1(String impEvent1) {
		this.impEvent1 = impEvent1;
	}

	public String getImpDate2() {
		return impDate2;
	}

	public void setImpDate2(String impDate2) {
		this.impDate2 = impDate2;
	}

	public String getImpEvent2() {
		return impEvent2;
	}

	public void setImpEvent2(String impEvent2) {
		this.impEvent2 = impEvent2;
	}

	public String getImpDate3() {
		return impDate3;
	}

	public void setImpDate3(String impDate3) {
		this.impDate3 = impDate3;
	}

	public String getImpEvent3() {
		return impEvent3;
	}

	public void setImpEvent3(String impEvent3) {
		this.impEvent3 = impEvent3;
	}

	public String getImpDate4() {
		return impDate4;
	}

	public void setImpDate4(String impDate4) {
		this.impDate4 = impDate4;
	}

	public String getImpEvent4() {
		return impEvent4;
	}

	public void setImpEvent4(String impEvent4) {
		this.impEvent4 = impEvent4;
	}

	public String getImpDate5() {
		return impDate5;
	}

	public void setImpDate5(String impDate5) {
		this.impDate5 = impDate5;
	}

	public String getImpEvent5() {
		return impEvent5;
	}

	public void setImpEvent5(String impEvent5) {
		this.impEvent5 = impEvent5;
	}

	public String getCountry() {
		return country;
	}

	public void setCountry(String country) {
		this.country = country;
	}

	public String getCity() {
		return city;
	}

	public void setCity(String city) {
		this.city = city;
	}

	public String getLocality() {
		return locality;
	}

	public void setLocality(String locality) {
		this.locality = locality;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public String getEmailId1() {
		return emailId1;
	}

	public void setEmailId1(String emailId1) {
		this.emailId1 = emailId1;
	}

	public String getEmailId2() {
		return emailId2;
	}

	public void setEmailId2(String emailId2) {
		this.emailId2 = emailId2;
	}

	public String getEmailId3() {
		return emailId3;
	}

	public void setEmailId3(String emailId3) {
		this.emailId3 = emailId3;
	}

	public String getEmailId4() {
		return emailId4;
	}

	public void setEmailId4(String emailId4) {
		this.emailId4 = emailId4;
	}

	public String getEmailId5() {
		return emailId5;
	}

	public void setEmailId5(String emailId5) {
		this.emailId5 = emailId5;
	}

	public String getPhone1() {
		return phone1;
	}

	public void setPhone1(String phone1) {
		this.phone1 = phone1;
	}

	public String getPhone2() {
		return phone2;
	}

	public void setPhone2(String phone2) {
		this.phone2 = phone2;
	}

	public String getPhone3() {
		return phone3;
	}

	public void setPhone3(String phone3) {
		this.phone3 = phone3;
	}

	public String getPhone4() {
		return phone4;
	}

	public void setPhone4(String phone4) {
		this.phone4 = phone4;
	}

	public String getPhone5() {
		return phone5;
	}

	public void setPhone5(String phone5) {
		this.phone5 = phone5;
	}

	public String getSpeaksLang() {
		return speaksLang;
	}

	public void setSpeaksLang(String speaksLang) {
		this.speaksLang = speaksLang;
	}

	public String getInterestedIn() {
		return interestedIn;
	}

	public void setInterestedIn(String interestedIn) {
		this.interestedIn = interestedIn;
	}

	public String getLikesDoing() {
		return likesDoing;
	}

	public void setLikesDoing(String likesDoing) {
		this.likesDoing = likesDoing;
	}

	public String getSufferingFrom() {
		return sufferingFrom;
	}

	public void setSufferingFrom(String sufferingFrom) {
		this.sufferingFrom = sufferingFrom;
	}

	public String getShareSufferingFrom() {
		return shareSufferingFrom;
	}

	public void setShareSufferingFrom(String shareSufferingFrom) {
		this.shareSufferingFrom = shareSufferingFrom;
	}

	public String getBlurb() {
		return blurb;
	}

	public void setBlurb(String blurb) {
		this.blurb = blurb;
	}

	public String getImageUrl1() {
		return imageUrl1;
	}

	public void setImageUrl1(String imageUrl1) {
		this.imageUrl1 = imageUrl1;
	}

	public String getImageUrl2() {
		return imageUrl2;
	}

	public void setImageUrl2(String imageUrl2) {
		this.imageUrl2 = imageUrl2;
	}

	public String getImageUrl3() {
		return imageUrl3;
	}

	public void setImageUrl3(String imageUrl3) {
		this.imageUrl3 = imageUrl3;
	}

}
