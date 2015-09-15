/**
 * 
 */
package com.beautifulyears.util.activityLogHandler;

import java.util.Date;

import org.springframework.data.mongodb.core.MongoTemplate;

import com.beautifulyears.constants.ActivityLogConstants;
import com.beautifulyears.domain.ActivityLog;
import com.beautifulyears.domain.User;

/**
 * @author Nitin
 *
 */
public class UserActivityLogHandler extends ActivityLogHandler<User> {

	public UserActivityLogHandler(MongoTemplate mongoTemplate) {
		super(mongoTemplate);
		// TODO Auto-generated constructor stub
	}

	@Override
	protected ActivityLog getEntityObject(User user, int crudType,
			User currentUser, String details) {
		ActivityLog log = new ActivityLog();
		if (user != null) {
			log.setUserId(currentUser.getId());
			log.setCurrentUserEmailId(currentUser.getEmail());
			log.setActivityTime(new Date());
			log.setActivityType(ActivityLogConstants.ACTIVITY_TYPE_USER);
			log.setCrudType(crudType);
			log.setDetails("ADMIN:  user id = " + user.getId() + "  "
					+ "  user name = " + user.getUserName()
					+ (details == null ? "" : details));
			log.setEntityId(user.getId());
			log.setRead(false);
			log.setTitleToDisplay(user.getUserName());
			if (null != currentUser) {
				log.setUserId(currentUser.getId());
			}
		}
		return log;
	}
}
