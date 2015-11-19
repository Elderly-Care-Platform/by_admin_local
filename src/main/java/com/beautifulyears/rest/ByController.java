package com.beautifulyears.rest;

import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.beautifulyears.domain.Language;
import com.beautifulyears.rest.response.BYGenericResponseHandler;

/**
 * The REST based service for managing "discuss"
 * 
 * @author jumpstart
 *
 */
@Controller
@RequestMapping(value = { "/by" })
public class ByController {
	private static final Logger logger = Logger
			.getLogger(ByController.class);
	private MongoTemplate mongoTemplate;

	@Autowired
	public ByController(MongoTemplate mongoTemplate) {
		this.mongoTemplate = mongoTemplate;
		// this.topicRepository = topicRepository;
	}


	@RequestMapping(method = { RequestMethod.GET }, value = { "/getLanguages" }, produces = { "application/json" })
	@ResponseBody
	public Object getLanguages()
			throws Exception {
		logger.debug("getting languages");
		List<Language> languages = null;
		languages = mongoTemplate.findAll(Language.class);
		return BYGenericResponseHandler.getResponse(languages);
	}
}
