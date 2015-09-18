package com.beautifulyears.rest;

import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
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
		DiscussReply newComment = discussCommentRepository.findOne(comment.getId());

		newComment.setStatus(comment.getStatus());

		discussCommentRepository.save(newComment);
		return BYGenericResponseHandler.getResponse(null);

	}
}
