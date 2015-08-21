/**
 * 
 */
package com.beautifulyears.util;

import java.util.List;

import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

import com.beautifulyears.domain.Discuss;
import com.beautifulyears.domain.DiscussReply;
import com.beautifulyears.domain.UserRating;

/**
 * @author Nitin
 *
 */
public class UserNameHandler implements Runnable {
	private MongoTemplate mongoTemplate;
	private String userName;
	private String userId;

	public UserNameHandler(MongoTemplate mongoTemplate) {
		this.mongoTemplate = mongoTemplate;
	}
	
	public void setUserParams(String userId, String userName){
		this.userId = userId;
		this.userName = userName;
	}

	@Override
	public void run() {
		List<Discuss> discussList = mongoTemplate.find(new Query(Criteria.where("userId").is(userId)), Discuss.class);
		for (Discuss discuss : discussList) {
			discuss.setUsername(userName);
			mongoTemplate.save(discuss);
		}
		
		List<DiscussReply> discussReplyList = mongoTemplate.find(new Query(Criteria.where("userId").is(userId)), DiscussReply.class);
		for (DiscussReply discussReply : discussReplyList) {
			discussReply.setUserName(userName);
			mongoTemplate.save(discussReply);
		}
		
		List<UserRating> userRatingList = mongoTemplate.find(new Query(Criteria.where("userId").is(userId)), UserRating.class);
		for (UserRating userRating : userRatingList) {
			userRating.setUserName(userName);
			mongoTemplate.save(userRating);
		}
	}

}
