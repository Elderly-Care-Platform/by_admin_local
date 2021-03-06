package com.beautifulyears.domain;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

import com.beautifulyears.domain.menu.Menu;

public class ServiceProviderInfo {

	private List<String> services = new ArrayList<String>(); // not applicable
																// for
																// individual
																// user types
																// who are not
																// service
																// providers.

	private boolean homeVisits = false;

	private String website;

	private int yearsExperience;

	private Date incorporationDate;

	private Map<String, List<Menu>> specialities;

	public ServiceProviderInfo() {
		super();
		// TODO Auto-generated constructor stub
	}

	public ServiceProviderInfo(List<String> services, boolean homeVisits,
			String website, int yearsExperience, Date incorporationDate,
			Map<String, List<Menu>> specialities) {
		super();
		this.services = services;
		this.homeVisits = homeVisits;
		this.website = website;
		this.yearsExperience = yearsExperience;
		this.incorporationDate = incorporationDate;
		this.specialities = specialities;
	}

	public Map<String, List<Menu>> getSpecialities() {
		return specialities;
	}

	public void setSpecialities(Map<String, List<Menu>> specialities) {
		this.specialities = specialities;
	}

	public List<String> getServices() {
		return services;
	}

	public void setServices(List<String> services) {
		this.services = services;
	}

	public boolean isHomeVisits() {
		return homeVisits;
	}

	public void setHomeVisits(boolean homeVisits) {
		this.homeVisits = homeVisits;
	}

	public String getWebsite() {
		return website;
	}

	public void setWebsite(String website) {
		this.website = website;
	}

	public int getYearsExperience() {
		return yearsExperience;
	}

	public void setYearsExperience(int yearsExperience) {
		this.yearsExperience = yearsExperience;
	}

	public Date getIncorporationDate() {
		return incorporationDate;
	}

	public void setIncorporationDate(Date incorporationDate) {
		this.incorporationDate = incorporationDate;
	}

	@Override
	public String toString() {
		return "ServiceProviderInfo [services=" + services + ", homeVisits="
				+ homeVisits + ", website=" + website + ", yearsExperience="
				+ yearsExperience + ", incorporationDate=" + incorporationDate
				+ "]";
	}

}
