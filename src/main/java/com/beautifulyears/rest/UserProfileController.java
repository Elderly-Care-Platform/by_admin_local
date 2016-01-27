package com.beautifulyears.rest;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Collections;
import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.bson.types.ObjectId;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.beautifulyears.constants.UserTypes;
import com.beautifulyears.domain.User;
import com.beautifulyears.domain.UserProfile;
import com.beautifulyears.exceptions.BYErrorCodes;
import com.beautifulyears.exceptions.BYException;
import com.beautifulyears.repository.UserProfileRepository;
import com.beautifulyears.repository.UserRepository;
import com.beautifulyears.rest.response.BYGenericResponseHandler;
import com.beautifulyears.rest.response.PageImpl;
import com.beautifulyears.rest.response.UserProfileResponse;
import com.beautifulyears.util.LoggerUtil;
import com.beautifulyears.util.Util;
import com.mongodb.BasicDBObject;

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
	
	private UserProfileRepository staticUserProfileRepository;
	private UserProfileRepository userProfileRepository;
	private MongoTemplate mongoTemplate; 

	@Autowired
	public UserProfileController(UserProfileRepository userProfileRepository,
			MongoTemplate mongoTemplate) {
		this.userProfileRepository = userProfileRepository;
		this.mongoTemplate = mongoTemplate;
		staticUserProfileRepository = userProfileRepository;
		
	}
	
	@RequestMapping(method = RequestMethod.GET, value = "/list/services", produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public Object allService(
			@RequestParam(value = "userTypes", required = false) Integer[] userTypes,
			@RequestParam(value = "city", required = false) String city,
			@RequestParam(value = "tags", required = false) List<String> tags,
			@RequestParam(value = "status", required = false) Boolean status,
			@RequestParam(value = "withdrawStatus", required = false) Integer withdrawStatus,
			@RequestParam(value = "startDate", required = false) Long startDate,
			@RequestParam(value = "endDate", required = false) Long endDate,
			HttpServletRequest request) throws Exception {

		UserProfileResponse.UserProfilePage servicePage = null;
		PageImpl<UserProfile> page = null;
		
		Direction sortDirection = Direction.DESC;
		
		String temp = "null";
		List<ObjectId> tagIds = new ArrayList<ObjectId>();
		
		if(temp.equals(city)){
			city = null;
		}
		
		if(temp.equals(tags)){
			tags = null;
		}
		
		if(temp.equals(status)){
			status = null;
		}
		
		if (null != tags) {
			for (String tagId : tags) {
				tagIds.add(new ObjectId(tagId));
			}
		}
		
		Date startDate1;
		Date endDate1;
		Calendar cal = Calendar.getInstance();
		if(null == startDate){
			startDate1 = null;
		}else{
			cal.setTime(new Date(startDate));
			cal.set(Calendar.HOUR_OF_DAY, 0);
			cal.set(Calendar.MINUTE, 0);
			cal.set(Calendar.SECOND, 0);
			cal.set(Calendar.MILLISECOND, 0);
			startDate1 = cal.getTime();
		}
		if(null == endDate){
			endDate1 = null;
		}else{
			cal.setTime(new Date(endDate));
			cal.set(Calendar.HOUR_OF_DAY, 23);
			cal.set(Calendar.MINUTE, 59);
			cal.set(Calendar.SECOND, 59);
			cal.set(Calendar.MILLISECOND, 999);
			endDate1 = cal.getTime();
		}
		
		
		Pageable pageable = new PageRequest(0, 400, sortDirection, "createdAt");
		page = staticUserProfileRepository.getServiceProvidersByFilterCriteria(userTypes, city, tagIds,
				status, withdrawStatus, startDate1, endDate1, null, pageable, null);
		servicePage = UserProfileResponse.getPage(page, null);
		return BYGenericResponseHandler.getResponse(servicePage);
	}
	
	@RequestMapping(method = RequestMethod.GET, value = "/list/cities", produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public Object allCities() {
		String collectionName = mongoTemplate.getCollectionName(UserProfile.class);
		List<Integer> userTypes = new ArrayList<Integer>();
		userTypes.add(4);
		userTypes.add(7);
		BasicDBObject query = new BasicDBObject();
		query.put("userTypes", new BasicDBObject("$in", userTypes));
		@SuppressWarnings("unchecked")
		List<String> cityList = mongoTemplate.getCollection(collectionName).distinct("basicProfileInfo.primaryUserAddress.city", query);
		return BYGenericResponseHandler.getResponse(cityList);
	}	
	
	@RequestMapping(method = { RequestMethod.GET }, value = { "/getByProfileId/{profileId}" }, produces = { "application/json" })
	@ResponseBody
	public Object getUserProfilebyProfileID(
			@PathVariable(value = "profileId") String profileId,
			HttpServletRequest req, HttpServletResponse res) throws Exception {
		LoggerUtil.logEntry();
		UserProfile userProfile = null;
		try {
			if (profileId != null) {
				userProfile = this.userProfileRepository.findById(profileId);
			} else {
				logger.error("invalid parameter");
			}

		} catch (Exception e) {
			logger.error("invalid parameter");
		}
		return BYGenericResponseHandler.getResponse(userProfile);
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
				userProfile = userProfileRepository.findByUserId(userId);
				if (userProfile == null) {
					logger.error("did not find any profile matching ID");
					userProfile = new UserProfile();
				} else {
					logger.debug(userProfile.toString());
				}
			} else {
				logger.error("invalid parameter");
				throw new BYException(BYErrorCodes.MISSING_PARAMETER);
			}

		} catch (Exception e) {
			Util.handleException(e);
		}
		return BYGenericResponseHandler.getResponse(userProfile);
	}
	
	/* This method allows the creation of a user profile */
	@RequestMapping(method = { RequestMethod.POST }, value = { "/{userId}" }, consumes = { "application/json" })
	@ResponseBody
	public Object submitUserProfile(@RequestBody UserProfile userProfile,
			HttpServletRequest req, HttpServletResponse res) throws Exception {

		LoggerUtil.logEntry();
		UserProfile profile = null;
		User currentUser = null;
		try {
			if ((userProfile != null)) {
				currentUser = Util.getSessionUser(req);
//				if (null != currentUser
//						&& SessionController.checkCurrentSessionFor(req,
//								"SUBMIT_PROFILE")) {
//					if (userProfile.getUserId() != null
//							&& userProfile.getUserId().equals(
//									currentUser.getId())) {
						if (this.userProfileRepository.findByUserId(userProfile
								.getUserId()) == null) {
							profile = new UserProfile();
							profile.setUserId(userProfile
									.getUserId());
							profile.setUserTypes(userProfile.getUserTypes());
							userProfileRepository.save(profile);
						} else {
							throw new BYException(
									BYErrorCodes.USER_ALREADY_EXIST);
						}
//					} else {
//						throw new BYException(BYErrorCodes.USER_NOT_AUTHORIZED);
//					}
//				} else {
//					throw new BYException(BYErrorCodes.USER_LOGIN_REQUIRED);
//				}
			} else {
				throw new BYException(BYErrorCodes.MISSING_PARAMETER);

			}
		} catch (Exception e) {
			Util.handleException(e);
		}
		return BYGenericResponseHandler.getResponse(UserProfileResponse
				.getUserProfileEntity(profile, currentUser));
	}

	/* @PathVariable(value = "userId") String userId */
	@RequestMapping(method = { RequestMethod.PUT }, value = { "/{userId}" }, consumes = { "application/json" })
	@ResponseBody
	public Object updateUserProfile(@RequestBody UserProfile userProfile,
			@PathVariable(value = "userId") String userId,
			HttpServletRequest req, HttpServletResponse res) throws Exception {

		
		LoggerUtil.logEntry();
		UserProfile profile = null;
		User currentUser = Util.getSessionUser(req);
		User user = mongoTemplate.findById(new ObjectId(userId), User.class);
		try {
			if ((userProfile != null) && (userId != null)) {
//				if (null != currentUser
//						&& SessionController.checkCurrentSessionFor(req,
//								"SUBMIT_PROFILE")) {
//					if (userProfile.getUserId().equals(currentUser.getId())) {
						profile = userProfileRepository.findByUserId(userId);

						if (profile != null) {
							profile.setUserTypes(userProfile.getUserTypes());
							userProfile.getBasicProfileInfo()
									.setShortDescription(
											getShortDescription(userProfile));
							profile.setLastModifiedAt(new Date());
							profile.setSystemTags(userProfile.getSystemTags());

							profile.setBasicProfileInfo(userProfile
									.getBasicProfileInfo());
							if (!Collections.disjoint(
									profile.getUserTypes(),
									new ArrayList<>(Arrays.asList(
											UserTypes.INDIVIDUAL_CAREGIVER,
											UserTypes.INDIVIDUAL_ELDER,
											UserTypes.INDIVIDUAL_PROFESSIONAL,
											UserTypes.INDIVIDUAL_VOLUNTEER)))) {
								profile.setIndividualInfo(userProfile
										.getIndividualInfo());
							} 

							if (profile.getUserTypes().contains(
									UserTypes.INSTITUTION_SERVICES)
									|| profile.getUserTypes().contains(
											UserTypes.INSTITUTION_BRANCH)) {
								profile.setServiceProviderInfo(userProfile
										.getServiceProviderInfo());
								List<UserProfile> branchInfo = saveBranches(
										userProfile.getServiceBranches(),
										userId);
								profile.setServiceBranches(branchInfo);

							} else if (profile.getUserTypes().contains(
									UserTypes.INDIVIDUAL_PROFESSIONAL)) {
								profile.setServiceProviderInfo(userProfile
										.getServiceProviderInfo());
							} else if (profile.getUserTypes().contains(
									UserTypes.INSTITUTION_HOUSING)) {
								profile.setFacilities(HousingController
										.addFacilities(
												userProfile.getFacilities(),
												user));
							}

							userProfileRepository.save(profile);
							logger.info("User Profile update with details: "
									+ profile.toString());
						} else {
							throw new BYException(
									BYErrorCodes.USER_PROFILE_DOES_NOT_EXIST);
						}

//					} else {
//						throw new BYException(BYErrorCodes.USER_NOT_AUTHORIZED);
//					}
//				} else {
//					throw new BYException(BYErrorCodes.USER_LOGIN_REQUIRED);
//				}
			}

			else {
				throw new BYException(BYErrorCodes.MISSING_PARAMETER);
			}
		} catch (Exception e) {
			Util.handleException(e);
		}

		return BYGenericResponseHandler.getResponse(UserProfileResponse
				.getUserProfileEntity(profile, currentUser));
	}
	
	private List<UserProfile> saveBranches(List<UserProfile> branchInfo,
			String userId) {
		for (UserProfile branch : branchInfo) {
			if (!branch.getUserTypes().contains(UserTypes.INSTITUTION_BRANCH)) {
				throw new BYException(BYErrorCodes.MISSING_PARAMETER);
			}
		}
		List<UserProfile> updateBranchInfo = new ArrayList<UserProfile>();
		for (UserProfile branch : branchInfo) {
			UserProfile newBranch = new UserProfile();
			if (null == branch.getId()) {
				newBranch.setUserId(userId);
				newBranch.setLastModifiedAt(new Date());
				newBranch.setBasicProfileInfo(branch.getBasicProfileInfo());
				newBranch.setIndividualInfo(branch.getIndividualInfo());
				newBranch.setServiceProviderInfo(branch
						.getServiceProviderInfo());
				newBranch.setSystemTags(branch.getSystemTags());
				newBranch.setTags(branch.getTags());
				newBranch.setUserTags(branch.getUserTags());
				ArrayList<Integer> list = new ArrayList<Integer>();
				list.add(UserTypes.INSTITUTION_BRANCH);
				newBranch.setUserTypes(list);
				branch = newBranch;
			} else {
				branch.setUserId(userId);
				branch.setLastModifiedAt(new Date());
			}

			mongoTemplate.save(branch);
			updateBranchInfo.add(branch);
		}
		return updateBranchInfo;
	}
	
	private String getShortDescription(UserProfile profile) {
		String shortDescription = null;
		if (null != profile.getBasicProfileInfo()
				&& null != profile.getBasicProfileInfo().getDescription()) {
			Document doc = Jsoup.parse(profile.getBasicProfileInfo()
					.getDescription());
			String longDesc = doc.text();
			String desc = Util.truncateText(doc.text());
			if (longDesc != null && !desc.equals(longDesc)) {
				shortDescription = desc;
			}
		}
		return shortDescription;
	}
	
}
