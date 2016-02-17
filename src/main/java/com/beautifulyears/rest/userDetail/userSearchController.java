package com.beautifulyears.rest.userDetail;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.regex.Pattern;

import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.beautifulyears.domain.User;
import com.beautifulyears.repository.UserRepository;
import com.beautifulyears.util.Util;

@Controller
@RequestMapping("/userSearch")
public class userSearchController {
	private MongoTemplate mongoTemplate;

	@Autowired
	public userSearchController(UserRepository userRepository,
			MongoTemplate mongoTemplate) {
		this.mongoTemplate = mongoTemplate;
	}

	@RequestMapping(method = RequestMethod.GET, value = "", produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public Object getUsers(@RequestParam(required = false) String userId,
			@RequestParam(required = false) String email,
			@RequestParam(required = false) String userName,
			@RequestParam(required = false) List<String> userTags,
			HttpServletRequest request) throws Exception {
		User user = Util.getSessionUser(request);
		Criteria mainCriteria = new Criteria();
		List<Criteria> orCriterias = new ArrayList<Criteria>();
		List<User> users = new ArrayList<User>();
		if (Util.isSuperUser(user)) {
			Query q = new Query();
			if (!Util.isEmpty(userId) && userId.length() > 3) {
				orCriterias.add(Criteria.where("id").is(userId));
			}
			if (!Util.isEmpty(email) && email.length() >= 3) {
				orCriterias.add(Criteria.where("email").regex(
						Pattern.compile(email, Pattern.CASE_INSENSITIVE
								| Pattern.UNICODE_CASE)));
			}
			if (!Util.isEmpty(userName) && userName.length() >= 3) {
				orCriterias.add(Criteria.where("userName").regex(
						Pattern.compile(userName, Pattern.CASE_INSENSITIVE
								| Pattern.UNICODE_CASE)));
			}
			if (null != userTags && userTags.size() > 0) {
//				List<ObjectId> tagIds = new ArrayList<ObjectId>();
//				for (String tagId : userTags) {
//					tagIds.add(new ObjectId(tagId));
//				}
				orCriterias.add(Criteria.where("userTags").all(userTags));
			}
			if (orCriterias.size() > 0) {
				q.addCriteria(mainCriteria.orOperator(orCriterias
						.toArray(new Criteria[orCriterias.size()])));
			}

			q.fields().include("id");
			users = mongoTemplate.find(q, User.class);
			Set<ObjectId> userIds = new HashSet<ObjectId>();
			for (User singleUser : users) {
				userIds.add(new ObjectId(singleUser.getId()));
			}
			System.out.println(userIds);
			q = new Query();
			q.addCriteria(Criteria.where("id").in(
					userIds.toArray(new Object[userIds.size()])));
			users = mongoTemplate.find(q, User.class);

		}

		return users;
	}

}
