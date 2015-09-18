package com.beautifulyears.rest;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;
import org.jsoup.Jsoup;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.beautifulyears.constants.ActivityLogConstants;
import com.beautifulyears.constants.DiscussConstants;
import com.beautifulyears.domain.Discuss;
import com.beautifulyears.domain.User;
import com.beautifulyears.domain.UserProfile;
import com.beautifulyears.domain.menu.Tag;
import com.beautifulyears.repository.DiscussRepository;
import com.beautifulyears.rest.response.BYGenericResponseHandler;
import com.beautifulyears.util.LoggerUtil;
import com.beautifulyears.util.Util;
import com.beautifulyears.util.activityLogHandler.ActivityLogHandler;
import com.beautifulyears.util.activityLogHandler.DiscussActivityLogHandler;

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
	ActivityLogHandler<Discuss> logHandler;
	private MongoTemplate mongoTemplate;

	@Autowired
	public AdminDiscussController(DiscussRepository discussRepository,
	// TopicRepository topicRepository,
			MongoTemplate mongoTemplate) {
		this.discussRepository = discussRepository;
		// this.topicRepository = topicRepository;
		this.mongoTemplate = mongoTemplate;
		logHandler = new DiscussActivityLogHandler(mongoTemplate);
	}

	@RequestMapping(value = "/{discussId}",consumes = { "application/json" })
	@ResponseBody
	public Object submitDiscuss(@RequestBody Discuss discuss,
			HttpServletRequest request) throws Exception {
		@SuppressWarnings("unused")
		User currentUser = Util.getSessionUser(request);
		if (discuss.getId() == null || discuss.getId().equals("")) {
			logger.debug("NEW DISCUSS");
			Discuss discussWithExtractedInformation = setDiscussBean(discuss);
			discussWithExtractedInformation = discussRepository
					.save(discussWithExtractedInformation);
			logHandler.addLog(discussWithExtractedInformation,
					ActivityLogConstants.CRUD_TYPE_CREATE, request);
			return BYGenericResponseHandler.getResponse(null);
		} else {
			logger.debug("EDIT DISCUSS");
			Discuss newDiscuss = getDiscussById(discuss.getId());
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
			newDiscuss.setUserProfile(discuss.getUserProfile());
			org.jsoup.nodes.Document doc = Jsoup.parse(discuss.getText());
			String domText = doc.text();
			if (domText.length() > DiscussConstants.DISCUSS_TRUNCATION_LENGTH) {
				newDiscuss.setShortSynopsis(Util.truncateText(domText));
			}
			newDiscuss.setTopicId(discuss.getTopicId());
			newDiscuss = discussRepository.save(newDiscuss);
			logHandler.addLog(newDiscuss,
					ActivityLogConstants.CRUD_TYPE_UPDATE, request);
			return BYGenericResponseHandler.getResponse(null);
		}
	}

	@RequestMapping(method = RequestMethod.GET, value = "/list/all", produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public Object allDiscuss(HttpServletRequest request) throws Exception {
		@SuppressWarnings("unused")
		User currentUser = Util.getSessionUser(request);
		List<Discuss> discussList = discussRepository.findAll(new Sort(
				Sort.Direction.DESC, "createdAt"));

		return BYGenericResponseHandler.getResponse(discussList);
	}

	@RequestMapping(method = RequestMethod.GET, value = "/list/{discussType}", produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public Object showDiscussByDiscussType(
			@PathVariable("discussType") String discussType,
			HttpServletRequest request) throws Exception {
		@SuppressWarnings("unused")
		User currentUser = Util.getSessionUser(request);
		try {
			Query q = new Query();
			q.addCriteria(Criteria.where("discussType").is(discussType));
			q.with(new Sort(Sort.Direction.DESC, "createdAt"));
			List<Discuss> list = mongoTemplate.find(q, Discuss.class);
			return BYGenericResponseHandler.getResponse(list);
		} catch (Exception e) {
			e.printStackTrace();
			return BYGenericResponseHandler
					.getResponse(new ArrayList<Discuss>());
		}

	}

	@RequestMapping(method = RequestMethod.GET, value = "/list/announceMents", produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public Object showDiscussAnnouncements(HttpServletRequest request)
			throws Exception {
		@SuppressWarnings("unused")
		User currentUser = Util.getSessionUser(request);
		try {
			Query q = new Query();
			q.addCriteria(Criteria.where("isPromotion").is(true));
			q.with(new Sort(Sort.Direction.DESC, "createdAt"));
			List<Discuss> list = mongoTemplate.find(q, Discuss.class);
			return list;
		} catch (Exception e) {
			throw new Exception();
		}

	}

	@RequestMapping(method = RequestMethod.GET, value = "/show/{discussId}", produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public Object showDiscuss(@PathVariable("discussId") String discussId,
			HttpServletRequest request) throws Exception {
		@SuppressWarnings("unused")
		User currentUser = Util.getSessionUser(request);
		Discuss discuss = discussRepository.findOne(discussId);
		if (discuss == null) {
			throw new DiscussNotFoundException(discussId);
		}
		return BYGenericResponseHandler.getResponse(discuss);
	}

	@RequestMapping(method = RequestMethod.GET, value = "/{discussId}", produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public Object getDiscuss(@PathVariable("discussId") String discussId,
			HttpServletRequest request) throws Exception {
		@SuppressWarnings("unused")
		User currentUser = Util.getSessionUser(request);
		Discuss discuss = getDiscussById(discussId);
		if (discuss == null) {
			throw new DiscussNotFoundException(discussId);
		}

		return BYGenericResponseHandler.getResponse(discuss);
	}

	@RequestMapping(method = RequestMethod.PUT, value = "/{discussId}", produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public Object editDiscuss(@PathVariable("discussId") String discussId,
			HttpServletRequest request) throws Exception {
		@SuppressWarnings("unused")
		User currentUser = Util.getSessionUser(request);
		Discuss discuss = discussRepository.findOne(discussId);
		if (discuss == null) {
			throw new DiscussNotFoundException(discussId);
		}
		return BYGenericResponseHandler.getResponse(discuss);
	}

	@RequestMapping(method = RequestMethod.DELETE, value = "/{discussId}", produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public Object deletePost(@PathVariable("discussId") String discussId,
			HttpServletRequest request) throws Exception {
		@SuppressWarnings("unused")
		User currentUser = Util.getSessionUser(request);
		Discuss discuss = discussRepository.findOne(discussId);
		if (null != discuss) {
			System.out.println("Inside DELETE");
			discussRepository.delete(discussId);
			logHandler.addLog(discuss, ActivityLogConstants.CRUD_TYPE_DELETE,
					request);
		} else {
			throw new Exception();
		}
		return BYGenericResponseHandler.getResponse(null);
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

			Query query = new Query();
			query.addCriteria(Criteria.where("userId").is(discuss.getUserId()));
			UserProfile profile = mongoTemplate.findOne(query,
					UserProfile.class);

			int aggrReplyCount = 0;
			newDiscuss = new Discuss(discuss.getUserId(),
					discuss.getUsername(), discussType, topicId, title, text,
					discussStatus, aggrReplyCount, systemTags,
					discuss.getShareCount(), discuss.getUserTags(),
					discuss.getDiscussType().equals("P") ? discuss
							.getArticlePhotoFilename() : null,
					discuss.isFeatured(), discuss.isPromotion(),
					discuss.getContentType(), discuss.getLinkInfo(), profile);
		} catch (Exception e) {
			throw new Exception();
		}
		return newDiscuss;
	}

	private Discuss getDiscussById(String discussId) throws Exception {
		Discuss discuss = discussRepository.findOne(discussId);
		return discuss;
	}
}
