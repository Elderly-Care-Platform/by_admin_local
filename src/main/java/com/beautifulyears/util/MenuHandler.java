/**
 * 
 */
package com.beautifulyears.util;

import java.util.List;

import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

import com.beautifulyears.domain.Discuss;
import com.beautifulyears.domain.HousingFacility;
import com.beautifulyears.domain.ServiceProviderInfo;
import com.beautifulyears.domain.UserProfile;
import com.beautifulyears.domain.menu.Menu;

/**
 * @author Nitin
 *
 */
public class MenuHandler implements Runnable {
	private MongoTemplate mongoTemplate;
	private Menu menu;

	public MenuHandler(MongoTemplate mongoTemplate) {
		this.mongoTemplate = mongoTemplate;
	}
	
	public void setParams(Menu menu){
		this.menu  = menu;
	}

	@Override
	public void run() {
		String menuId  = this.menu.getId();
		List<UserProfile> profiles = mongoTemplate.find(new Query(Criteria.where("serviceProviderInfo.services").in(menuId)), UserProfile.class);
		for (UserProfile profile : profiles) {
			ServiceProviderInfo serviceProviderInfo = profile.getServiceProviderInfo();
			if(null != serviceProviderInfo){
				serviceProviderInfo.getServices().remove(menuId);
			}
			mongoTemplate.save(profile);
		}
		
		List<HousingFacility> housings = mongoTemplate.find(new Query(Criteria.where("categoriesId").in(menuId)), HousingFacility.class);
		for (HousingFacility housing : housings) {
			if(null != housing.getCategoriesId()){
				housing.getCategoriesId().remove(menuId);
			}
			mongoTemplate.save(housing);
		}
		
		List<Discuss> discussList = mongoTemplate.find(new Query(Criteria.where("topicId").in(menuId)), Discuss.class);
		for (Discuss discuss : discussList) {
			if(null != discuss.getTopicId()){
				discuss.getTopicId().remove(menuId);
			}
			mongoTemplate.save(discuss);
		}
		
		
	}

}
