/**
 * 
 */
package com.beautifulyears.util.activityLogHandler;

import java.util.Date;

import org.springframework.data.mongodb.core.MongoTemplate;

import com.beautifulyears.constants.ActivityLogConstants;
import com.beautifulyears.constants.BYConstants;
import com.beautifulyears.constants.UserTypes;
import com.beautifulyears.domain.ActivityLog;
import com.beautifulyears.domain.User;
import com.beautifulyears.domain.UserProfile;

/**
 * @author Nitin
 *
 */
public class UserProfileLogHandler extends ActivityLogHandler<UserProfile> {

	public UserProfileLogHandler(MongoTemplate mongoTemplate) {
		super(mongoTemplate);
		// TODO Auto-generated constructor stub
	}

	@Override
	protected ActivityLog getEntityObject(UserProfile profile, int crudType,
			User currentUser, String details) {
		ActivityLog log = new ActivityLog();
		if (profile != null) {
			log.setActivityTime(new Date());
			if (profile.getUserTypes().contains(
					UserTypes.INDIVIDUAL_PROFESSIONAL)
					|| profile
							.getUserTypes()
							.contains(
									UserTypes.INSTITUTION_SERVICES)){
				log.setActivityType(ActivityLogConstants.ACTIVITY_TYPE_SERVICE);
			}else{
				log.setActivityType(ActivityLogConstants.ACTIVITY_TYPE_PROFILE);
			}
				
			log.setCrudType(crudType);
			log.setDetails("userProfile id = " + profile.getId() + "  "
					+ (details == null ? "" : details));
			log.setEntityId(profile.getUserId());
			log.setRead(false);
			log.setTitleToDisplay(profile.getId());
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
