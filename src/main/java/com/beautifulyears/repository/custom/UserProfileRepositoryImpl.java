package com.beautifulyears.repository.custom;

import java.util.Date;
import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

import com.beautifulyears.constants.DiscussConstants;
import com.beautifulyears.domain.UserProfile;
import com.beautifulyears.rest.response.PageImpl;

public class UserProfileRepositoryImpl implements UserProfileRepositoryCustom {
	@Autowired
	private MongoTemplate mongoTemplate;

	@Override
	public PageImpl<UserProfile> getServiceProvidersByFilterCriteria(
			Object[] userTypes, String city, List<ObjectId> tagIds, Boolean status, Integer withdrawStatus, 
			Date startDate, Date endDate, Boolean isFeatured, Pageable page, List<String> fields) {
		List<UserProfile> userProfileList = null;
		Query q = new Query();
		/*q.addCriteria(Criteria.where("status").in(
				new Object[] { DiscussConstants.DISCUSS_STATUS_ACTIVE, null }));*/
		if(null != userTypes && userTypes.length > 0){
			q.addCriteria(Criteria.where("userTypes").in(
					userTypes));
		}
		if(null != status){
			q.addCriteria(Criteria.where("verified").is(
					status));
		}
		
		if (withdrawStatus != null) {
			q.addCriteria(Criteria.where("status").is(withdrawStatus));
		}
		
		if (endDate != null && startDate != null) {
			q.addCriteria(Criteria.where("createdAt").lte(endDate).gte(startDate));
		}
		
		if (null != isFeatured) {
			q.addCriteria(Criteria.where("isFeatured").is(isFeatured));
		}

		if (null != tagIds && tagIds.size() > 0) {
			q.addCriteria(Criteria.where("systemTags.$id").in(tagIds));
		}
		if (city != null) {
			Criteria criteria = new Criteria();
			criteria.orOperator(
					Criteria.where("basicProfileInfo.primaryUserAddress.city")
							.regex(city, "i"),
					Criteria.where("basicProfileInfo.otherAddresses")
							.elemMatch(Criteria.where("city").regex(city, "i")));

			q.addCriteria(criteria);
		}
		if (null != fields && fields.size() > 0) {
			for (String field : fields) {
				q.fields().include(field);
			}

		}
		q.with(page);
		
		userProfileList = mongoTemplate.find(q, UserProfile.class);

		long total = this.mongoTemplate.count(q, UserProfile.class);
		PageImpl<UserProfile> userProfilePage = new PageImpl<UserProfile>(
				userProfileList, page, total);

		return userProfilePage;
	}

	@Override
	public PageImpl<UserProfile> findAllUserProfiles(Pageable pageable) {
		Query q = new Query();
		q.addCriteria(Criteria.where("status").in(
				new Object[] { DiscussConstants.DISCUSS_STATUS_ACTIVE, null }));
		List<UserProfile> userProfileList = mongoTemplate.find(q,
				UserProfile.class);
		long total = userProfileList.size();
		PageImpl<UserProfile> userProfilePage = new PageImpl<UserProfile>(
				userProfileList, pageable, total);
		return userProfilePage;
	}

}