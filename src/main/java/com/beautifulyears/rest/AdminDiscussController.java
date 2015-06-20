package com.beautifulyears.rest;

import java.util.ArrayList;
import java.util.List;

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
import com.beautifulyears.repository.custom.DiscussRepositoryCustom;

/**
 * The REST based service for managing "discuss"
 * 
 * @author jumpstart
 *
 */
@Controller
@RequestMapping("/discuss")
public class AdminDiscussController {

	private DiscussRepository discussRepository;
	private MongoTemplate mongoTemplate;

	@Autowired
	public AdminDiscussController(DiscussRepository discussRepository,
			DiscussRepositoryCustom discussRepositoryCustom,
			MongoTemplate mongoTemplate) {
		this.discussRepository = discussRepository;
		this.mongoTemplate = mongoTemplate;
	}

	@RequestMapping(consumes = { "application/json" })
	@ResponseBody
	public ResponseEntity<Void> submitDiscuss(@RequestBody Discuss discuss) {

		if (discuss == null || discuss.getId() == null
				|| discuss.getId().equals("")) {
			System.out.println("NEW DISCUSS");
			Discuss discussWithExtractedInformation = setDiscussBean(discuss);
			discussRepository.save(discussWithExtractedInformation);
			ResponseEntity<Void> responseEntity = new ResponseEntity<>(
					HttpStatus.CREATED);
			return responseEntity;
		} else {
			System.out.println("EDIT DISCUSS");
			Discuss newDiscuss = getDiscuss(discuss.getId());
			newDiscuss.setDiscussType(discuss.getDiscussType());
			newDiscuss.setTitle(discuss.getTitle());
			newDiscuss.setStatus(discuss.getStatus());
			newDiscuss.setFeatured(discuss.getFeatured());
			newDiscuss.setArticlePhotoFilename(discuss.getArticlePhotoFilename());

			System.out.println("** status from form = ** "
					+ discuss.getStatus());
			System.out.println("** text from form = ** " + discuss.getText());
			String tags = discuss.getTags();
			String edited_tags = "";

			if (tags != null) {
				String[] tagArr = tags.split(",");

				String new_tag_str = "";

				// ignore the first 2 tags (topic and subtpic) - this will giive
				// us user entered tags
				for (int i = 0; i < tagArr.length; i++) {
					new_tag_str = new_tag_str + tagArr[i] + ",";
				}

				// prepend new subtopic and topic (if that is the case in edit)
				edited_tags = discuss.getTopicId() + ","
						+ discuss.getSubTopicId() + "," + new_tag_str;
			} else {
				edited_tags = discuss.getTopicId() + ","
						+ discuss.getSubTopicId();
			}
			newDiscuss.setTags(edited_tags);

			newDiscuss.setText(discuss.getText());
			newDiscuss.setUserId(discuss.getUserId());
			newDiscuss.setTopicId(discuss.getTopicId());
			newDiscuss.setSubTopicId(discuss.getSubTopicId());
			discussRepository.save(newDiscuss);
			ResponseEntity<Void> responseEntity = new ResponseEntity<>(
					HttpStatus.CREATED);
			System.out.println("responseEntity = " + responseEntity);
			return responseEntity;
		}
	}

	@RequestMapping(method = RequestMethod.GET, value = "/list/all", produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public List<Discuss> allDiscuss() {
		System.out.println("show ALL discuss of ALL discuss types");
		return discussRepository.findAll(new Sort(Sort.Direction.DESC,
				"createdAt"));
	}

	@RequestMapping(method = RequestMethod.GET, value = "/list/{discussType}", produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public List<Discuss> showDiscussByDiscussType(
			@PathVariable("discussType") String discussType) {
		try {
			System.out.println("show ALL discuss of discuss type = "
					+ discussType);
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
		String tagsToShowToUser = discuss.getTags();
		if (tagsToShowToUser != null) {
			tagsToShowToUser = tagsToShowToUser.substring(tagsToShowToUser
					.indexOf(",") + 1);
			tagsToShowToUser = tagsToShowToUser.substring(tagsToShowToUser
					.indexOf(",") + 1);
			discuss.setTags(tagsToShowToUser);

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

		System.out.println(">> text = " + discuss.getText());
		System.out.println(">> status = " + discuss.getStatus());
		String tagsToShowToUser = discuss.getTags();
		if (tagsToShowToUser != null) {
			tagsToShowToUser = tagsToShowToUser.substring(tagsToShowToUser
					.indexOf(",") + 1);
			tagsToShowToUser = tagsToShowToUser.substring(tagsToShowToUser
					.indexOf(",") + 1);
			discuss.setTags(tagsToShowToUser);

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
		String tagsToShowToUser = discuss.getTags();
		if (tagsToShowToUser != null) {
			tagsToShowToUser = tagsToShowToUser.substring(tagsToShowToUser
					.indexOf(",") + 1);
			tagsToShowToUser = tagsToShowToUser.substring(tagsToShowToUser
					.indexOf(",") + 1);
			discuss.setTags(tagsToShowToUser);

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
		System.out.println("responseEntity = " + responseEntity);
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
			String discussStatus = discuss.getStatus() == null ? "0" : "1";
			String topicId = discuss.getTopicId();
			String subTopicId = discuss.getSubTopicId();
			String tags = discuss.getTags() == null ? (topicId + "," + subTopicId)
					: topicId + "," + subTopicId + "," + discuss.getTags();
			int aggrReplyCount = 0;
			int aggrLikeCount = 0;
			
			System.out.println("### FEATURED #### " + discuss.getFeatured());

			return new Discuss(userId, username, discussType, topicId,
					subTopicId, title, text, discussStatus, tags,
					aggrReplyCount, aggrLikeCount, discuss.getArticlePhotoFilename() == null ? "":discuss.getArticlePhotoFilename(), discuss.getFeatured());

		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}

	}
}
