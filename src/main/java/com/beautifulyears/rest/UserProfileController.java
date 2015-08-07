package com.beautifulyears.rest;

import java.util.Date;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.beautifulyears.domain.User;
import com.beautifulyears.domain.UserProfile;
import com.beautifulyears.repository.UserProfileRepository;
import com.beautifulyears.util.LoggerUtil;
import com.beautifulyears.util.Util;

/**
 * The REST based service for managing "user_profile"
 * 
 * @author jharana
 *
 */
@Controller
@RequestMapping("/userProfile")
public class UserProfileController {
	private static Logger logger = Logger
			.getLogger(UserProfileController.class);

	private UserProfileRepository userProfileRepository;
	private MongoTemplate mongoTemplate;

	@Autowired
	public UserProfileController(UserProfileRepository userProfileRepository,
			MongoTemplate mongoTemplate) {
		this.userProfileRepository = userProfileRepository;
		this.mongoTemplate = mongoTemplate;
	}

	@RequestMapping(method = { RequestMethod.GET }, value = { "/{userId}" }, produces = { "application/json" })
	@ResponseBody
	public Object getUserProfilebyID(
			@PathVariable(value = "userId") String userId,
			HttpServletRequest req, HttpServletResponse res) throws Exception {
		LoggerUtil.logEntry();
		UserProfile userProfile = null;
		try {
			if (userId != null) {
				userProfile = this.userProfileRepository.findByUserId(userId);
			} else {
				logger.error("invalid parameter");
			}

		} catch (Exception e) {
			logger.error("invalid parameter");
		}
		return userProfile;
	}

	/* @PathVariable(value = "userId") String userId */
	@RequestMapping(method = { RequestMethod.PUT }, value = { "/{userId}" }, consumes = { "application/json" })
	@ResponseBody
	public Object updateUserProfile(@RequestBody UserProfile userProfile,
			@PathVariable(value = "userId") String userId,
			HttpServletRequest req, HttpServletResponse res) throws Exception {

		LoggerUtil.logEntry();
		UserProfile profile = null;
		try {
			if ((userProfile != null) && (userId != null)) {
						profile = userProfileRepository.findByUserId(userId);

						if (profile != null) {
							profile.setStatus(userProfile.getStatus());
							profile.setFeatured(userProfile.isFeatured());
							logger.info("User Profile update with details: "
									+ profile.toString());
						}else{
							logger.debug("new user profile created");
							User user = mongoTemplate.findById(profile, User.class);
							if(user != null){
								userProfile = new UserProfile();
								userProfile.setUserId(user.getId());;
								userProfile.getBasicProfileInfo().setPrimaryEmail(user.getEmail());
								userProfile.setStatus(userProfile.getStatus());
								userProfile.setFeatured(userProfile.isFeatured());
							}
							
						}
						userProfileRepository.save(profile);
				}
		} catch (Exception e) {
			logger.error("error ");
		}

		return profile;
	}
}
