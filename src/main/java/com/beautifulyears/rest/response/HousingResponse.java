package com.beautifulyears.rest.response;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.data.annotation.Id;

import com.beautifulyears.domain.HousingFacility;
import com.beautifulyears.domain.User;
import com.beautifulyears.domain.UserAddress;
import com.beautifulyears.domain.menu.Tag;

public class HousingResponse implements IResponse {

	private List<HousingEntity> housingArray = new ArrayList<HousingEntity>();

	@Override
	public List<HousingEntity> getResponse() {
		// TODO Auto-generated method stub
		return this.housingArray;
	}

	public static class HousingPage {
		private List<HousingEntity> content = new ArrayList<HousingEntity>();
		private boolean lastPage;
		private long number;
		private long size;
		private long total;

		public HousingPage() {
			super();
		}

		public HousingPage(PageImpl<HousingFacility> page, User user) {
			this.lastPage = page.isLastPage();
			this.number = page.getNumber();
			for (HousingFacility housingFacility : page.getContent()) {
				this.content.add(new HousingEntity(housingFacility, user));
			}
			this.size = page.getSize();
			this.total = page.getTotal();
		}

		public long getTotal() {
			return total;
		}

		public void setTotal(long total) {
			this.total = total;
		}

		public long getSize() {
			return size;
		}

		public void setSize(long size) {
			this.size = size;
		}

		public List<HousingEntity> getContent() {
			return content;
		}

		public void setContent(List<HousingEntity> content) {
			this.content = content;
		}

		public boolean isLastPage() {
			return lastPage;
		}

		public void setLastPage(boolean lastPage) {
			this.lastPage = lastPage;
		}

		public long getNumber() {
			return number;
		}

		public void setNumber(long number) {
			this.number = number;
		}

	}

	public static class HousingEntity {

		@Id
		private String id;
		private String userId;
		private String name;

		private UserAddress primaryAddress = new UserAddress();
		private String primaryEmail;
		private String primaryPhoneNo;
		private List<String> categoriesId;
		private List<Tag> systemTags;

		private Float ratingPercentage = 0f;
		private int ratingCount;
		private int reviewCount;
		private boolean isReviewedByUser = false;
		private boolean isRatedByUser = false;
		private Date createdAt = new Date();
		private Date lastModifiedAt = new Date();
		private boolean isVerified = false;

		public HousingEntity(HousingFacility housing, User user) {
			this.id = housing.getId();
			this.userId = housing.getUserId();
			this.name = housing.getName();
			this.primaryAddress = housing.getPrimaryAddress();
			this.primaryPhoneNo = housing.getPrimaryPhoneNo();
			this.primaryEmail = housing.getPrimaryEmail();
			this.categoriesId = housing.getCategoriesId();
			this.ratingPercentage = housing.getAggrRatingPercentage();
			this.createdAt = housing.getCreatedAt();
			this.lastModifiedAt = housing.getLastModifiedAt();
			this.systemTags = housing.getSystemTags();
			this.isVerified = housing.isVerified();

			if (null != user && housing.getRatedBy().contains(user.getId())) {
				this.isReviewedByUser = true;
			}
			if (null != user && housing.getReviewedBy().contains(user.getId())) {
				this.isReviewedByUser = true;
			}
			ratingCount = housing.getRatedBy().size();
			reviewCount = housing.getReviewedBy().size();
		}

		public boolean isVerified() {
			return isVerified;
		}

		public List<Tag> getSystemTags() {
			return systemTags;
		}

		public String getId() {
			return id;
		}

		public String getUserId() {
			return userId;
		}

		public String getName() {
			return name;
		}

		public UserAddress getPrimaryAddress() {
			return primaryAddress;
		}
		
		public String getPrimaryPhoneNo() {
			return primaryPhoneNo;
		}
		
		public String getPrimaryEmail() {
			return primaryEmail;
		}
		
		public List<String> getCategoriesId() {
			return categoriesId;
		}

		public Float getRatingPercentage() {
			return ratingPercentage;
		}

		public int getRatingCount() {
			return ratingCount;
		}

		public int getReviewCount() {
			return reviewCount;
		}

		public boolean isReviewedByUser() {
			return isReviewedByUser;
		}

		public boolean isRatedByUser() {
			return isRatedByUser;
		}

		public Date getCreatedAt() {
			return createdAt;
		}

		public Date getLastModifiedAt() {
			return lastModifiedAt;
		}

	}

	public void add(List<HousingFacility> housingArray) {
		for (HousingFacility housing : housingArray) {
			this.housingArray.add(new HousingEntity(housing, null));
		}
	}

	public void add(HousingFacility housing) {
		this.housingArray.add(new HousingEntity(housing, null));
	}

	public void add(List<HousingFacility> housingArray, User user) {
		for (HousingFacility housing : housingArray) {
			this.housingArray.add(new HousingEntity(housing, user));
		}
	}

	public void add(HousingFacility housing, User user) {
		this.housingArray.add(new HousingEntity(housing, user));
	}

	public static HousingPage getPage(PageImpl<HousingFacility> page, User user) {
		HousingPage res = new HousingPage(page, user);
		return res;
	}

	public HousingEntity getDiscussEntity(HousingFacility housing, User user) {
		return new HousingEntity(housing, user);
	}

	public static HousingEntity getHousingEntity(
			HousingFacility housingFacility, User user) {
		HousingEntity res = null;
		if (null != housingFacility) {
			res = new HousingEntity(housingFacility, user);
		}
		return res;
	}

}
