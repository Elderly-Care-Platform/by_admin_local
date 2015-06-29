package com.beautifulyears.rest;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.beautifulyears.domain.Discuss;
import com.beautifulyears.repository.DiscussRepository;
import com.beautifulyears.repository.TopicRepository;

/**
 * The REST based service for managing "discuss"
 * 
 * @author jumpstart
 *
 */
@Controller
@RequestMapping("/discuss")
public class AdminDiscussController {
	private static final Logger logger = Logger
			.getLogger(AdminDiscussController.class);
	private DiscussRepository discussRepository;
	private TopicRepository topicRepository;
	private MongoTemplate mongoTemplate;

	@Autowired
	public AdminDiscussController(DiscussRepository discussRepository,
			TopicRepository topicRepository,
			MongoTemplate mongoTemplate) {
		this.discussRepository = discussRepository;
		this.topicRepository = topicRepository;
		this.mongoTemplate = mongoTemplate;
	}

	@RequestMapping(consumes = { "application/json" })
	@ResponseBody
	public ResponseEntity<Void> submitDiscuss(@RequestBody Discuss discuss) {

		if (discuss.getId() == null
				|| discuss.getId().equals("")) {
			logger.debug("NEW DISCUSS");
			Discuss discussWithExtractedInformation = setDiscussBean(discuss);
			discussRepository.save(discussWithExtractedInformation);
			ResponseEntity<Void> responseEntity = new ResponseEntity<>(
					HttpStatus.CREATED);
			return responseEntity;
		} else {
			logger.debug("EDIT DISCUSS");
			Discuss newDiscuss = getDiscuss(discuss.getId());
			newDiscuss.setDiscussType(discuss.getDiscussType());
			newDiscuss.setTitle(discuss.getTitle());
			newDiscuss.setStatus(discuss.getStatus());
			newDiscuss.setFeatured(discuss.isFeatured());
			newDiscuss.setArticlePhotoFilename(discuss
					.getArticlePhotoFilename());
			newDiscuss.setLastModifiedAt(new Date());
			newDiscuss.setText(discuss.getText());
			newDiscuss.setTopicId(discuss.getTopicId());
			discussRepository.save(newDiscuss);
			ResponseEntity<Void> responseEntity = new ResponseEntity<>(
					HttpStatus.CREATED);
			return responseEntity;
		}
	}

	@RequestMapping(method = RequestMethod.GET, value = "/list/all", produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public List<Discuss> allDiscuss() {
		return discussRepository.findAll(new Sort(Sort.Direction.DESC,
				"createdAt"));
	}

	@RequestMapping(method = RequestMethod.GET, value = "/list/{discussType}", produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public List<Discuss> showDiscussByDiscussType(
			@PathVariable("discussType") String discussType) {
		try {
			Query q = new Query();
			q.addCriteria(Criteria.where("discussType").is(discussType));
			q.with(new Sort(Sort.Direction.DESC, "createdAt"));
			List<Discuss> list = mongoTemplate.find(q, Discuss.class);
			return list;
		} catch (Exception e) {
			e.printStackTrace();
			return new ArrayList<Discuss>();
		}

	}

	@RequestMapping(method = RequestMethod.GET, value = "/show/{discussId}", produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public Discuss showDiscuss(@PathVariable("discussId") String discussId) {
		Discuss discuss = discussRepository.findOne(discussId);
		if (discuss == null) {
			throw new DiscussNotFoundException(discussId);
		}
		return discuss;
	}

	@RequestMapping(method = RequestMethod.GET, value = "/{discussId}", produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public Discuss getDiscuss(@PathVariable("discussId") String discussId) {
		Discuss discuss = discussRepository.findOne(discussId);
		if (discuss == null) {
			throw new DiscussNotFoundException(discussId);
		}

		return discuss;
	}

	@RequestMapping(method = RequestMethod.PUT, value = "/{discussId}", produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public Discuss editDiscuss(@PathVariable("discussId") String discussId) {
		Discuss discuss = discussRepository.findOne(discussId);
		if (discuss == null) {
			throw new DiscussNotFoundException(discussId);
		}
		return discuss;
	}

	@RequestMapping(method = RequestMethod.DELETE, value = "/{discussId}", produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public ResponseEntity<Void> deletePost(
			@PathVariable("discussId") String discussId) {
		System.out.println("Inside DELETE");
		discussRepository.delete(discussId);
		ResponseEntity<Void> responseEntity = new ResponseEntity<>(
				HttpStatus.CREATED);
		return responseEntity;
	}

	private Discuss setDiscussBean(Discuss discuss) {

		try {
			String userId = discuss.getUserId();
			String username = discuss.getUsername();
			String discussType = discuss.getDiscussType();
			String title = "";
			if (discussType.equalsIgnoreCase("A")) {
				title = discuss.getTitle();
			}
			String text = discuss.getText();
			int discussStatus = discuss.getStatus();
			List<String> topicIds = discuss.getTopicId();
			int aggrReplyCount = 0;
			int aggrLikeCount = 0;
			
			List<String> systemTags = topicRepository.getTopicNames(topicIds);

			return new Discuss(userId, username, discussType, topicIds, title,
					text, discussStatus, discuss.getAggrReplyCount(),
					systemTags, discuss.getUserTags(),
					discuss.getArticlePhotoFilename() == null ? "" : discuss
							.getArticlePhotoFilename(), discuss.isFeatured());

		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}

	}
}
