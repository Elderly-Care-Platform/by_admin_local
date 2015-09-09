/**
 * 
 */
package com.beautifulyears.rest;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.beautifulyears.domain.HousingFacility;
import com.beautifulyears.domain.User;
import com.beautifulyears.domain.UserProfile;
import com.beautifulyears.repository.HousingRepository;
import com.beautifulyears.util.LoggerUtil;

/**
 * @author Nitin
 *
 */

@Controller
@RequestMapping("/housing")
public class HousingController {
	private static Logger logger = Logger
			.getLogger(HousingController.class);
	private HousingRepository housingRepository;
	private MongoTemplate mongoTemplate;

	// private static final Logger logger =
	// Logger.getLogger(HousingController.class);

	@Autowired
	public HousingController(HousingRepository housingRepository,MongoTemplate mongoTemplate) {
		this.housingRepository = housingRepository;
		this.mongoTemplate = mongoTemplate;
	}

	@RequestMapping(method = RequestMethod.GET, value = "/list/all", produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public List<HousingFacility> allDiscuss() {
		return housingRepository.findAll(new Sort(Sort.Direction.DESC,
				"createdAt"));
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
		return housingFacility;
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
							housingRepository.save(facility);
							logger.info("User Profile update with details: "
									+ facility.toString());
						}
						
				}
		} catch (Exception e) {
			logger.error("error ");
		}

		return facility;
	}

}
