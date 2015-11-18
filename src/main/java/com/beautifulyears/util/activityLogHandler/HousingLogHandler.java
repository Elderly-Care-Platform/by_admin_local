/**
 * 
 */
package com.beautifulyears.util.activityLogHandler;

import java.util.Date;

import org.springframework.data.mongodb.core.MongoTemplate;

import com.beautifulyears.constants.ActivityLogConstants;
import com.beautifulyears.constants.BYConstants;
import com.beautifulyears.domain.ActivityLog;
import com.beautifulyears.domain.HousingFacility;
import com.beautifulyears.domain.User;

/**
 * @author Nitin
 *
 */
public class HousingLogHandler extends ActivityLogHandler<HousingFacility> {

	public HousingLogHandler(MongoTemplate mongoTemplate) {
		super(mongoTemplate);
	}


	@Override
	protected ActivityLog getEntityObject(HousingFacility housing, int crudType,
			User currentUser, String details) {
		ActivityLog log = new ActivityLog();
		if (housing != null) {
			log.setActivityTime(new Date());
			log.setActivityType(ActivityLogConstants.ACTIVITY_TYPE_HOUSING);
			log.setCrudType(crudType);
			log.setDetails("housing id = " + housing.getId() + "  "
					+ (details == null ? "" : details));
			log.setEntityId(housing.getId());
			log.setRead(false);
			log.setTitleToDisplay(housing.getName());
			if (null != currentUser) {
				log.setUserId(currentUser.getId());
				if(currentUser.getRegType() == BYConstants.REGISTRATION_TYPE_EMAIL){
					log.setCurrentUserEmailId(currentUser.getEmail());
				}else if(currentUser.getRegType() == BYConstants.REGISTRATION_TYPE_PHONE){
					log.setCurrentUserEmailId(currentUser.getPhoneNumber());
				}
			}
		}
		return log;
	}
}
