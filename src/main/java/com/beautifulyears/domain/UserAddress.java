package com.beautifulyears.domain;

import org.springframework.data.mongodb.core.index.TextIndexed;


/** The UserAddress class specifies address information of all types of users including 
*  individual and institutions. 
*  Documents corresponding to this class are stored as part of user_profile document in MongodB.
*  @author jharana
*/

public class UserAddress {

	
	private String streetAddress; 
	@TextIndexed
	private String city;	
	@TextIndexed
	private String zip; 
	@TextIndexed
	private String locality;
	private String country;
	
	public UserAddress() {

	}

	
	public UserAddress(String streetAddress, String city, String zip,
			String locality, String country) {
		super();
		this.streetAddress = streetAddress;
		this.city = city;
		this.zip = zip;
		this.locality = locality;
		this.country = country;
	}
	public String getStreetAddress() {
		return streetAddress;
	}
	public void setStreetAddress(String streetAddress) {
		this.streetAddress = streetAddress;
	}
	public String getCity() {
		return this.city;
	}
	public void setCity(String city) {
		this.city = city;
	}
	public String getZip() {
		return zip;
	}
	public void setZip(String zip) {
		this.zip = zip;
	}
	public String getLocality() {
		return locality;
	}
	public void setLocality(String locality) {
		this.locality = locality;
	}
	public String getCountry() {
		return this.country;
	}
	public void setCountry(String country) {
		this.country = country;
	}


	@Override
	public String toString() {
		return "UserAddress [streetAddress=" + streetAddress + ", city=" + city
				+ ", zip=" + zip + ", locality=" + locality + ", country="
				+ country + "]";
	}
	
	
	
}
