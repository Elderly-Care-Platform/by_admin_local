package com.beautifulyears.rest.userDetail;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.beautifulyears.domain.ActivityLog;
import com.beautifulyears.domain.Session;
import com.beautifulyears.domain.SiteSession;
import com.beautifulyears.domain.User;
import com.beautifulyears.domain.UserProfile;
import com.beautifulyears.repository.UserRepository;
import com.beautifulyears.util.Util;

//import com.beautifulyears.domain.UserProfile;

@Controller
@RequestMapping("/userDetail")
public class UserDetailController {

	private MongoTemplate mongoTemplate;

	@Autowired
	public UserDetailController(UserRepository userRepository,
			MongoTemplate mongoTemplate) {
		this.mongoTemplate = mongoTemplate;
	}

	@RequestMapping(method = RequestMethod.GET, value = "/userInfo", produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public Object getUserInfo(@RequestParam(required = true) String userId,
			HttpServletRequest request) throws Exception {
		User user = new User();
		User currentUser = Util.getSessionUser(request);
		if (Util.isSuperUser(currentUser) && null != userId) {
			user = mongoTemplate.findById(userId, User.class);
		}
		return user;
	}

	@RequestMapping(method = RequestMethod.GET, value = "/userProfileInfo", produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public Object getUserProfileInfo(
			@RequestParam(required = true) String userId,
			HttpServletRequest request) throws Exception {
		List<UserProfile> userProfiles = new ArrayList<UserProfile>();
		User currentUser = Util.getSessionUser(request);
		if (Util.isSuperUser(currentUser) && null != userId) {
			Query q = new Query();
			q.addCriteria(Criteria.where("userId").is(userId));
			userProfiles = mongoTemplate.find(q, UserProfile.class);
		}
		return userProfiles;
	}

	@RequestMapping(method = RequestMethod.GET, value = "/lastSessionInfo", produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public Object getUserLastSessionDetails(
			@RequestParam(required = true) String userId,
			HttpServletRequest request) throws Exception {
		SiteSession session = null;
		User currentUser = Util.getSessionUser(request);
		if (Util.isSuperUser(currentUser) && null != userId) {
			Query query = new Query();
			query.addCriteria(Criteria.where("userId").is(userId));
			query.limit(1);
			query.with(new Sort(Sort.Direction.DESC, "createdAt"));
			session = mongoTemplate.findOne(query, SiteSession.class);
		}
		return session;
	}

	@RequestMapping(method = RequestMethod.GET, value = "/lastActivityInfo", produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public Object getUserLastActivity(
			@RequestParam(required = true) String userId,
			HttpServletRequest request) throws Exception {
		ActivityLog activity = null;
		User currentUser = Util.getSessionUser(request);
		if (Util.isSuperUser(currentUser) && null != userId) {
			Query query = new Query();
			query.addCriteria(Criteria.where("userId").is(userId));
			query.limit(1);
			query.with(new Sort(Sort.Direction.DESC, "activityTime"));
			activity = mongoTemplate.findOne(query, ActivityLog.class);
		}
		return activity;
	}

	@RequestMapping(method = RequestMethod.GET, value = "/activities", produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public Object getUserActivity(@RequestParam(required = true) String userId,
			HttpServletRequest request) throws Exception {
		List<ActivityLog> activities = new ArrayList<ActivityLog>();
		User currentUser = Util.getSessionUser(request);
		if (Util.isSuperUser(currentUser) && null != userId) {
			Query query = new Query();
			query.addCriteria(Criteria.where("userId").is(userId));
			query.with(new Sort(Sort.Direction.DESC, "activityTime"));
			activities = mongoTemplate.find(query, ActivityLog.class);
		}
		return activities;
	}

}