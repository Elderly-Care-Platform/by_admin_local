/**
 * 
 */
package com.beautifulyears.rest;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.bson.types.ObjectId;
import org.jsoup.Jsoup;
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

import com.beautifulyears.constants.ActivityLogConstants;
import com.beautifulyears.constants.DiscussConstants;
import com.beautifulyears.domain.HousingFacility;
import com.beautifulyears.domain.User;
import com.beautifulyears.repository.HousingRepository;
import com.beautifulyears.rest.response.BYGenericResponseHandler;
import com.beautifulyears.rest.response.HousingResponse;
import com.beautifulyears.rest.response.PageImpl;
import com.beautifulyears.util.LoggerUtil;
import com.beautifulyears.util.Util;
import com.beautifulyears.util.activityLogHandler.ActivityLogHandler;
import com.beautifulyears.util.activityLogHandler.HousingLogHandler;

/**
 * @author Nitin
 *
 */

@Controller
@RequestMapping("/housing")
public class HousingController {
	private static Logger logger = Logger.getLogger(HousingController.class);
	private static HousingRepository staticHousingRepository;
	private HousingRepository housingRepository;
	private MongoTemplate mongoTemplate;
	private static MongoTemplate staticMongoTemplate;
	private static ActivityLogHandler<HousingFacility> logHandler;
	// private static final Logger logger =
	// Logger.getLogger(HousingController.class);

	@Autowired
	public HousingController(HousingRepository housingRepository,
			MongoTemplate mongoTemplate) {
		this.housingRepository = housingRepository;
		this.mongoTemplate = mongoTemplate;
		staticHousingRepository = housingRepository;
		staticMongoTemplate = mongoTemplate;
		logHandler = new HousingLogHandler(mongoTemplate);
	}

	/*@RequestMapping(method = RequestMethod.GET, value = "/list/all", produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public Object allDiscuss() {
		List<HousingFacility> housingList = housingRepository.findAll(new Sort(
				Sort.Direction.DESC, "createdAt"));
		return BYGenericResponseHandler.getResponse(housingList);
	}*/
	
	@RequestMapping(method = RequestMethod.GET, value = "/list/all", produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public Object allDiscuss(
			@RequestParam(value = "city", required = false) String city,
			@RequestParam(value = "tags", required = false) List<String> tags,
			@RequestParam(value = "startDate", required = false) Long startDate,
			@RequestParam(value = "endDate", required = false) Long endDate,
			HttpServletRequest request) throws Exception {

		HousingResponse.HousingPage housingPage = null;
		PageImpl<HousingFacility> page = null;
		
		Direction sortDirection = Direction.DESC;
	
		String temp = "null";
		List<ObjectId> tagIds = new ArrayList<ObjectId>();
		if(temp.equals(city)){
			city = null;
		}
		if(temp.equals(tags)){
			tags = null;
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
		
		Pageable pageable = new PageRequest(0, 100, sortDirection, "createdAt");
		page = staticHousingRepository.getPage(city, tagIds, startDate1, endDate1, null, null, null, pageable);
		housingPage = HousingResponse.getPage(page, null);
		return BYGenericResponseHandler.getResponse(housingPage);
	}
	
	@RequestMapping(method = RequestMethod.GET, value = "/list/cities", produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public Object allCities() {
		String collectionName = mongoTemplate.getCollectionName(HousingFacility.class);
		@SuppressWarnings("unchecked")
		List<String> cityList = mongoTemplate.getCollection(collectionName).distinct("primaryAddress.city");
		return BYGenericResponseHandler.getResponse(cityList);
	}	

	@RequestMapping(method = { RequestMethod.GET }, value = { "/{housingId}" }, produces = { "application/json" })
	@ResponseBody
	public Object getHousingbyID(
			@PathVariable(value = "housingId") String housingId,
			HttpServletRequest req, HttpServletResponse res) throws Exception {
		LoggerUtil.logEntry();
		HousingFacility housingFacility = null;
		try {
			if (housingId != null) {
				housingFacility = this.housingRepository.findById(housingId);
			} else {
				logger.error("invalid parameter");
			}

		} catch (Exception e) {
			logger.error("invalid parameter");
		}
		return BYGenericResponseHandler.getResponse(housingFacility);
	}

	/* @PathVariable(value = "userId") String userId */
	@RequestMapping(method = { RequestMethod.PUT }, value = { "/{housingId}" }, consumes = { "application/json" })
	@ResponseBody
	public Object updateHousing(@RequestBody HousingFacility housingFacility,
			@PathVariable(value = "housingId") String housingId,
			HttpServletRequest req, HttpServletResponse res) throws Exception {

		LoggerUtil.logEntry();
		HousingFacility facility = null;
		try {
			if ((housingFacility != null) && (housingId != null)) {
				facility = housingRepository.findById(housingId);

				if (facility != null) {
					facility.setStatus(housingFacility.getStatus());
					facility.setFeatured(housingFacility.isFeatured());
					facility.setVerified(housingFacility.isVerified());
					housingRepository.save(facility);
					logger.info("User Profile update with details: "
							+ facility.toString());
				}

			}
		} catch (Exception e) {
			logger.error("error ");
		}

		return BYGenericResponseHandler.getResponse(facility);
	}
	
	public static List<HousingFacility> addFacilities(
			List<HousingFacility> facilities, User user) {
		List<HousingFacility> existingFacilities = staticHousingRepository
				.findByUserId(user.getId());

		ArrayList<HousingFacility> newlyAdded = new ArrayList<HousingFacility>(
				facilities);
		newlyAdded.removeAll(existingFacilities);

		ArrayList<HousingFacility> removed = new ArrayList<HousingFacility>(
				existingFacilities);
		removed.removeAll(facilities);

		ArrayList<HousingFacility> updated = new ArrayList<HousingFacility>(
				facilities);
		updated.retainAll(existingFacilities);

		for (HousingFacility removedFacility : removed) {
			staticMongoTemplate.remove(removedFacility);
			logHandler.addLog(removedFacility,
					ActivityLogConstants.CRUD_TYPE_DELETE, null, user);
		}

		for (HousingFacility addedFacility : newlyAdded) {
			addedFacility.setUserId(user.getId());
			HousingFacility newFacility = new HousingFacility();
			updateHousing(newFacility, addedFacility);
			newFacility.setLastModifiedAt(new Date());
			staticMongoTemplate.save(newFacility);
			logHandler.addLog(newFacility,
					ActivityLogConstants.CRUD_TYPE_CREATE, null, user);
			facilities.set(facilities.indexOf(addedFacility), newFacility);
		}

		for (HousingFacility updatedFacility : updated) {
			HousingFacility old = existingFacilities.get(existingFacilities
					.indexOf(updatedFacility));
			updateHousing(old, updatedFacility);
			old.setLastModifiedAt(new Date());
			staticMongoTemplate.save(old);
			logHandler.addLog(old, ActivityLogConstants.CRUD_TYPE_UPDATE, null,
					user);
		}

		return facilities;
	}
	
	private static void updateHousing(HousingFacility oldHousing,
			HousingFacility newHousing) {
		oldHousing.setDescription(newHousing.getDescription());
		oldHousing.setName(newHousing.getName());
		oldHousing.setPhotoGalleryURLs(newHousing.getPhotoGalleryURLs());
		oldHousing.setPrimaryAddress(newHousing.getPrimaryAddress());
		oldHousing.setPrimaryEmail(newHousing.getPrimaryEmail());
		oldHousing.setPrimaryPhoneNo(newHousing.getPrimaryPhoneNo());
		oldHousing.setProfileImage(newHousing.getProfileImage());
		oldHousing.setSecondaryEmails(newHousing.getSecondaryEmails());
		oldHousing.setSecondaryPhoneNos(newHousing.getSecondaryPhoneNos());
		oldHousing.setWebsite(newHousing.getWebsite());
		oldHousing.setUserId(newHousing.getUserId());
		oldHousing.setCategoriesId(newHousing.getCategoriesId());
		if (!Util.isEmpty(newHousing.getDescription())) {
			org.jsoup.nodes.Document doc = Jsoup.parse(newHousing
					.getDescription());
			String domText = doc.text();
			if (domText.length() > DiscussConstants.DISCUSS_TRUNCATION_LENGTH) {
				oldHousing.setShortDescription(Util.truncateText(domText));
			}
		}
		oldHousing.setSystemTags(newHousing.getSystemTags());
		oldHousing.setTier(newHousing.getTier());
	}


}
