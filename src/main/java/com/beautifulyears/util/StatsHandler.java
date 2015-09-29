package com.beautifulyears.util;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

import com.beautifulyears.constants.UserTypes;
import com.beautifulyears.domain.Discuss;
import com.beautifulyears.domain.HousingFacility;
import com.beautifulyears.domain.User;
import com.beautifulyears.domain.UserProfile;

public class StatsHandler  implements Runnable{
	
	public static Map<String,Long> countMap = new HashMap<String, Long>();
	public static long postCount = 0;
	public static long userCount = 0;
	public static long questionCount = 0;
	public static long housingCount = 0;
	public static long serviceCount = 0;
	List<Integer> serviceTypes = new ArrayList<Integer>();
	

	private MongoTemplate mongoTemplate;
	
	public StatsHandler(MongoTemplate mongoTemplate) {
		this.mongoTemplate = mongoTemplate;
		serviceTypes.add(UserTypes.INDIVIDUAL_PROFESSIONAL);
		serviceTypes.add(UserTypes.INSTITUTION_NGO);
		serviceTypes.add(UserTypes.INSTITUTION_SERVICES);
	}

	@Override
	public void run() {
		countMap = new HashMap<String, Long>();
		
		Query query = new Query(Criteria.where("discussType").is("P"));
		StatsHandler.countMap.put("postCount",mongoTemplate.count(query, Discuss.class));
		
		query = new Query(Criteria.where("discussType").is("Q"));
		StatsHandler.countMap.put("questionCount",mongoTemplate.count(query, Discuss.class));
		
		query = new Query();
		StatsHandler.countMap.put("userCount",mongoTemplate.count(query, User.class));
		
		query = new Query();
		StatsHandler.countMap.put("housingCount",mongoTemplate.count(query, HousingFacility.class));
		
		
		query = new Query(Criteria.where("userTypes").in(serviceTypes));
		StatsHandler.countMap.put("serviceCount",mongoTemplate.count(query, UserProfile.class));
	}
	
	

}
