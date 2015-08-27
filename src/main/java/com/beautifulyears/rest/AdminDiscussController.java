package com.beautifulyears.rest;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.apache.log4j.Logger;
import org.jsoup.Jsoup;
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

import com.beautifulyears.Util;
import com.beautifulyears.constants.DiscussConstants;
import com.beautifulyears.domain.Discuss;
import com.beautifulyears.domain.menu.Tag;
import com.beautifulyears.repository.DiscussRepository;
import com.beautifulyears.util.LoggerUtil;

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
//	private TopicRepository topicRepository;
	private MongoTemplate mongoTemplate;

	@Autowired
	public AdminDiscussController(DiscussRepository discussRepository,
//			TopicRepository topicRepository,
			MongoTemplate mongoTemplate) {
		this.discussRepository = discussRepository;
//		this.topicRepository = topicRepository;
		this.mongoTemplate = mongoTemplate;
	}

	@RequestMapping(consumes = { "application/json" })
	@ResponseBody
	public ResponseEntity<Void> submitDiscuss(@RequestBody Discuss discuss) throws Exception {

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
			newDiscuss.setPromotion(discuss.isPromotion());
			newDiscuss.setArticlePhotoFilename(discuss
					.getArticlePhotoFilename());
			newDiscuss.setSystemTags(discuss.getSystemTags());
			newDiscuss.setLastModifiedAt(new Date());
			newDiscuss.setText(discuss.getText());
			newDiscuss.setContentType(discuss.getContentType());
			newDiscuss.setLinkInfo(discuss.getLinkInfo());
			org.jsoup.nodes.Document doc = Jsoup.parse(discuss.getText());
			String domText = doc.text();
			if(domText.length() > DiscussConstants.DISCUSS_TRUNCATION_LENGTH){
				newDiscuss.setShortSynopsis(Util.truncateText(domText));
			}
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
	
	@RequestMapping(method = RequestMethod.GET, value = "/list/announceMents", produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public List<Discuss> showDiscussAnnouncements() {
		try {
			Query q = new Query();
			q.addCriteria(Criteria.where("isPromotion").is(true));
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

	private Discuss setDiscussBean(Discuss discuss) throws Exception {
		LoggerUtil.logEntry();
		Discuss newDiscuss = null;
		try {

			String discussType = discuss.getDiscussType();
			String title = "";
			if (discussType.equalsIgnoreCase("P")) {
				title = discuss.getTitle();
			}
			String text = discuss.getText();
			int discussStatus = discuss.getStatus();
			List<String> topicId = discuss.getTopicId();
			List<Tag> systemTags = new ArrayList<Tag>();
			// List<String> systemTags = new ArrayList<String>();
			// if (null != topicId && topicId.size() > 0) {
			// systemTags = topicRepository.getTopicNames(topicId);
			// }
			for (Tag tag : discuss.getSystemTags()) {
				Tag newTag = mongoTemplate.findById(tag.getId(), Tag.class);
				systemTags.add(newTag);
			}

			int aggrReplyCount = 0;
			newDiscuss = new Discuss(discuss.getUserId(),
					discuss.getUsername(), discussType, topicId, title, text,
					discussStatus, aggrReplyCount, systemTags,
					discuss.getShareCount(), discuss.getUserTags(),
					discuss.getDiscussType().equals("P") ? discuss
							.getArticlePhotoFilename() : null, discuss.isFeatured(),discuss.isPromotion(),
					discuss.getContentType(), discuss.getLinkInfo());
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
		return newDiscuss;
	}
}
