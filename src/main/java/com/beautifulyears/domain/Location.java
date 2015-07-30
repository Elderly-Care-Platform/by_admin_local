/**
 * 
 */
package com.beautifulyears.domain;

import org.springframework.data.mongodb.core.mapping.Document;

/**
 * @author Nitin
 *
 */
@Document(collection = "locations")
public class Location {
	private String id;
	private String officename;
	private Long pincode;
	private String divisionname;
	private String regionname;
	private String Taluk;
	private String Districtname;
	private String statename;
	private String country;
	
	public String getCountry() {
		return country;
	}
	public void setCountry(String country) {
		this.country = country;
	}
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getOfficename() {
		return officename;
	}
	public void setOfficename(String officename) {
		this.officename = officename;
	}
	public Long getPincode() {
		return pincode;
	}
	public void setPincode(Long pincode) {
		this.pincode = pincode;
	}
	public String getDivisionname() {
		return divisionname;
	}
	public void setDivisionname(String divisionname) {
		this.divisionname = divisionname;
	}
	public String getRegionname() {
		return regionname;
	}
	public void setRegionname(String regionname) {
		this.regionname = regionname;
	}
	public String getTaluk() {
		return Taluk;
	}
	public void setTaluk(String taluk) {
		Taluk = taluk;
	}
	public String getDistrictname() {
		return Districtname;
	}
	public void setDistrictname(String districtname) {
		Districtname = districtname;
	}
	public String getStatename() {
		return statename;
	}
	public void setStatename(String statename) {
		this.statename = statename;
	}
	
	
	
}
