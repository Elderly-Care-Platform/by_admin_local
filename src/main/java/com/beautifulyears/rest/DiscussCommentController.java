package com.beautifulyears.rest;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;
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

import com.beautifulyears.constants.DiscussConstants;
import com.beautifulyears.domain.Discuss;
import com.beautifulyears.domain.DiscussReply;
import com.beautifulyears.repository.DiscussCommentRepository;
import com.beautifulyears.rest.response.BYGenericResponseHandler;
import com.beautifulyears.util.Util;

/**
 * The REST based service for managing "comment"
 * 
 * @author jumpstart
 *
 */
@Controller
@RequestMapping("/comment")
public class DiscussCommentController {
	private Logger logger = Logger.getLogger(DiscussCommentController.class);

	private DiscussCommentRepository discussCommentRepository;
	private MongoTemplate mongoTemplate;

	@Autowired
	public DiscussCommentController(
			DiscussCommentRepository discussCommentRepository,
			MongoTemplate mongoTemplate) {
		this.discussCommentRepository = discussCommentRepository;
		this.mongoTemplate = mongoTemplate;
	}

	@RequestMapping(method = RequestMethod.GET, value = "/{commentId}", produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public Object getComment(@PathVariable("commentId") String commentId) {
		DiscussReply comment = discussCommentRepository.findOne(commentId);
		if (comment == null) {
			throw new DiscussNotFoundException(commentId);
		}
		return BYGenericResponseHandler.getResponse(comment);
	}

	@RequestMapping(method = RequestMethod.GET, value = "/{discussId}/{parentReplyId}", produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public Object allDiscussComment(
			@PathVariable("discussId") String discussId,
			@PathVariable("parentReplyId") String parentReplyId)
			throws Exception {
		List<DiscussReply> result = new ArrayList<DiscussReply>();
		Query q = new Query();
		/*
		 * if (!Util.isEmpty(discussId)) { // top level q = new
		 * BasicQuery("{ $where : 'this.parentId == this._id' }");
		 * q.addCriteria(Criteria.where("discussId").is(discussId)); } else
		 */
		if (!Util.isEmpty(discussId)) {
			// looking for children
			q = new Query();
			q.addCriteria(Criteria.where("discussId").is(discussId));
			if (!Util.isEmpty(parentReplyId) && !"null".equals(parentReplyId)) {
				q.addCriteria(Criteria.where("parentReplyId").is(parentReplyId));
			} else {
				q.addCriteria(Criteria.where("parentReplyId").in(
						new Object[] { "", null }));
			}
			result = mongoTemplate.find(q, DiscussReply.class);
			getActualChildrenCount(result);
		} else {
			throw new Exception();
		}
		return BYGenericResponseHandler.getResponse(result);
	}

	// Editing a comment
	@RequestMapping(value = "/{commentId}", consumes = { "application/json" })
	@ResponseBody
	public Object submitComment(@RequestBody DiscussReply comment) {

		logger.debug("EDIT COMMENT");
		DiscussReply newComment = discussCommentRepository.findOne(comment
				.getId());

		newComment.setStatus(comment.getStatus());
		if (newComment.getStatus() != comment.getStatus()) {
			updateReplyCount(newComment);
		}
		discussCommentRepository.save(newComment);
		updateReplyCount(newComment);
		return BYGenericResponseHandler.getResponse(null);
	}

	private void updateReplyCount(DiscussReply reply) {
		String discussId = reply.getDiscussId();
		Discuss discuss = mongoTemplate.findById(discussId, Discuss.class);
		if (null != discuss) {
			int count = 0;
			int directReplyCount = 0;
			Query query = new Query();
			query.addCriteria(Criteria.where("discussId").is(discussId))
					.addCriteria(
							Criteria.where("status").is(
									DiscussConstants.REPLY_STATUS_ACTIVE));
			query.with(new Sort(Sort.Direction.ASC,
					new String[] { "createdAt" }));
			List<DiscussReply> replies = this.mongoTemplate.find(query,
					DiscussReply.class);

			Map<String, DiscussReply> tempMap = new HashMap<String, DiscussReply>();
			List<DiscussReply> repliesList = new ArrayList<DiscussReply>();
			for (DiscussReply discussReply : replies) {
				discussReply.setChildrenCount(0);
				discussReply.setDirectChildrenCount(0);
				tempMap.put(discussReply.getId(), discussReply);
				if (!Util.isEmpty(discussReply.getParentReplyId())) {
					if (null != tempMap.get(discussReply.getParentReplyId())) {
						tempMap.get(discussReply.getParentReplyId())
								.getReplies().add(discussReply);
						count++;
						tempMap.get(discussReply.getParentReplyId())
								.setDirectChildrenCount(
										tempMap.get(
												discussReply.getParentReplyId())
												.getDirectChildrenCount() + 1);
						updateParentCount(tempMap, discussReply);
					}
				} else {
					repliesList.add(0, discussReply);
					directReplyCount++;
					count++;
				}
				mongoTemplate.save(discussReply);
			}

			discuss.setAggrReplyCount(count);
			discuss.setDirectReplyCount(directReplyCount);
			mongoTemplate.save(discuss);
		}
	}

	private void updateParentCount(Map<String, DiscussReply> tempMap,
			DiscussReply discussReply) {
		if (!Util.isEmpty(discussReply.getParentReplyId())
				&& null != tempMap.get(discussReply.getParentReplyId())) {
			tempMap.get(discussReply.getParentReplyId()).setChildrenCount(
					tempMap.get(discussReply.getParentReplyId())
							.getChildrenCount() + 1);
			mongoTemplate.save(tempMap.get(discussReply.getParentReplyId()));
			updateParentCount(tempMap,
					tempMap.get(discussReply.getParentReplyId()));
		}
	}

	private void getActualChildrenCount(List<DiscussReply> replies) {
		for (DiscussReply discussReply : replies) {

			Query q = new Query();
			q.addCriteria(Criteria.where("parentReplyId").is(
					discussReply.getId()));
			long childCount = mongoTemplate.count(q, DiscussReply.class);
			discussReply.setDirectChildrenCount((int) childCount);
		}
	}

}
