/**
 * 
 */
package com.beautifulyears.util.activityLogHandler;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;

import com.beautifulyears.domain.ActivityLog;
import com.beautifulyears.domain.User;
import com.beautifulyears.util.Util;

/**
 * @author Nitin
 *
 */
public abstract class ActivityLogHandler<T> {

	private MongoTemplate mongoTemplate;

	public ActivityLogHandler() {
		super();
		// TODO Auto-generated constructor stub
	}

	@Autowired
	public ActivityLogHandler(MongoTemplate mongoTemplate) {
		super();
		this.mongoTemplate = mongoTemplate;
	}

	public void addLog(T entity, int crudType, HttpServletRequest req) {
		User currentUser = Util.getSessionUser(req);
		ActivityLog log = getEntityObject(entity, crudType, currentUser, null);
		this.postActivity(log);
	}

	public void addLog(T entity, int crudType, String detail,
			HttpServletRequest req) {
		User currentUser = Util.getSessionUser(req);
		ActivityLog log = getEntityObject(entity, crudType, currentUser, detail);
		this.postActivity(log);
	}

	protected void postActivity(ActivityLog log) {
		mongoTemplate.save(log);
	}

	protected abstract ActivityLog getEntityObject(T entity, int crudType,
			User currentUser, String details);
}
