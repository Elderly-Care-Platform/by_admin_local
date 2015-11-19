/**
 * 
 */
package com.beautifulyears.repository.custom;

import java.util.Date;
import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

import com.beautifulyears.domain.HousingFacility;
import com.beautifulyears.rest.response.PageImpl;

/**
 * @author Nitin
 *
 */
public class HousingRepositoryImpl implements HousingRepositoryCustom {
	@Autowired
	private MongoTemplate mongoTemplate;

	@Override
	public PageImpl<HousingFacility> getPage(String city,
			List<ObjectId> tagIds, Integer withdrawStatus, Date startDate, Date endDate, String userId, Boolean isFeatured,
			Boolean isPromotion, Pageable pageable) {
		List<HousingFacility> housings = null;

		Query query = new Query();
		query = getQuery(query, tagIds, userId, isFeatured, isPromotion);
		query.with(pageable);

		if (city != null) {
			query.addCriteria(Criteria.where("primaryAddress.city").regex(city,
					"i"));
		}
		
		if (withdrawStatus != null) {
			query.addCriteria(Criteria.where("status").is(withdrawStatus));
		}
		
		if (endDate != null && startDate != null) {
			query.addCriteria(Criteria.where("createdAt").lte(endDate).gte(startDate));
		}

		housings = this.mongoTemplate.find(query, HousingFacility.class);

		long total = this.mongoTemplate.count(query, HousingFacility.class);
		PageImpl<HousingFacility> housingPage = new PageImpl<HousingFacility>(
				housings, pageable, total);

		return housingPage;
	}

	private Query getQuery(Query q, List<ObjectId> tagIds, String userId,
			Boolean isFeatured, Boolean isPromotion) {

		if (null != tagIds && tagIds.size() > 0) {
			q.addCriteria(Criteria.where("systemTags.$id").in(tagIds));
		}
		if (null != isFeatured) {
			q.addCriteria(Criteria.where("isFeatured").is(isFeatured));
		}
		if (null != isPromotion) {
			q.addCriteria(Criteria.where("isPromotion").is(isPromotion));
		}
		if (null != userId) {
			q.addCriteria(Criteria.where("userId").is(userId));
		}

		return q;
	}

}
