package com.beautifulyears.rest;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.BasicQuery;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.beautifulyears.Util;
import com.beautifulyears.domain.Discuss;
import com.beautifulyears.domain.DiscussComment;
import com.beautifulyears.domain.User;
import com.beautifulyears.repository.DiscussCommentRepository;
import com.beautifulyears.repository.DiscussRepository;

/**
 * The REST based service for managing "comment"
 * 
 * @author jumpstart
 *
 */
@Controller
@RequestMapping("/comment")
public class DiscussCommentController {
	private Logger logger = LoggerFactory
			.getLogger(DiscussCommentController.class);

	private DiscussCommentRepository discussCommentRepository;
	private DiscussRepository discussRepository;
	private MongoTemplate mongoTemplate;

	@Autowired
	public DiscussCommentController(
			DiscussCommentRepository discussCommentRepository,
			DiscussRepository discussRepository, MongoTemplate mongoTemplate) {
		this.discussCommentRepository = discussCommentRepository;
		this.discussRepository = discussRepository;
		this.mongoTemplate = mongoTemplate;
	}

	@RequestMapping(method = RequestMethod.GET, value = "/{commentId}", produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public DiscussComment getComment(@PathVariable("commentId") String commentId) {
		DiscussComment comment = discussCommentRepository.findOne(commentId);
		if (comment == null) {
			throw new DiscussNotFoundException(commentId);
		}

		System.out.println(">> text = " + comment.getDiscussCommenContent());
		System.out.println(">> status = " + comment.getStatus());

		return comment;
	}

	@RequestMapping(method = RequestMethod.GET, value = "/{parentId}/{ancestorId}", produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public List<DiscussComment> allDiscussComment(

	@PathVariable("parentId") String parentId,
			@PathVariable("ancestorId") String ancestorId) {
		List<DiscussComment> result = new ArrayList<DiscussComment>();
		boolean buildTree = false;
		Query q = new Query();
		/*
		 * if (!Util.isEmpty(discussId)) { // top level q = new
		 * BasicQuery("{ $where : 'this.parentId == this._id' }");
		 * q.addCriteria(Criteria.where("discussId").is(discussId)); } else
		 */
		if (!Util.isEmpty(parentId) && Util.isEmpty(ancestorId)) {
			// looking for children
			q = new BasicQuery("{ $where : 'this.parentId != this._id' }");
			q.addCriteria(Criteria.where("parentId").is(parentId));
		} else if (!Util.isEmpty(parentId) && !Util.isEmpty(ancestorId)) {
			// looking for tree
			if (parentId.equals(ancestorId)) {
				// tree from some discuss -- This could be a LARGE amount of
				// data
				q = new Query();
				q.addCriteria(Criteria.where("ancestorId").is(ancestorId));

			} else {
				// tree from some comment node
				DiscussComment rootDiscussComment = mongoTemplate.findOne(
						new Query().addCriteria(Criteria.where("id").is(
								parentId)), DiscussComment.class);
				if (rootDiscussComment != null) {
					q.addCriteria(Criteria.where("ancestorId").is(ancestorId));
					q.addCriteria(Criteria.where("ancestorOffset").gt(
							rootDiscussComment == null ? 0 : rootDiscussComment
									.getAncestorOffset()));
					buildTree = true;
				} else {
					q = new Query();
				}
			}
			// Need flattened data for admin comment management
			// ?????buildTree = true;
		} /*
		 * else if (!Util.isEmpty(id)) {// instance
		 * q.addCriteria(Criteria.where("id").is(id)); }
		 */
		if (!q.equals(new Query())) {
			q.with(new Sort(Sort.Direction.ASC, "ancestorOffset"));
			q.with(new Sort(Sort.Direction.DESC, "createdAt"));
			logger.info(q.toString());
			result = mongoTemplate.find(q, DiscussComment.class);
		}
		if (buildTree) {
			result = buildTree(result);
		}
		return result;
	}

	private List<DiscussComment> buildTree(List<DiscussComment> result) {
		// The list contains a flattened tree .. convert Back to a tree.
		Map<String, DiscussComment> nodesMap = new HashMap<String, DiscussComment>(
				25);
		List<DiscussComment> tree = new ArrayList<DiscussComment>();
		if (result != null && !result.isEmpty()) {
			int startOffset = result.get(0).getAncestorOffset();
			DiscussComment curDiscussComment = null;
			DiscussComment curParentDiscussComment = null;
			Iterator<DiscussComment> it = result.iterator();
			while (it.hasNext()) {
				curDiscussComment = it.next();
				nodesMap.put(curDiscussComment.getId(), curDiscussComment);
				if (curDiscussComment.getAncestorOffset() == startOffset) {
					tree.add(curDiscussComment);
					nodesMap.put(curDiscussComment.getId(), curDiscussComment);
				} else {
					curParentDiscussComment = nodesMap.get(curDiscussComment
							.getParentId());
					if (curParentDiscussComment != null) {
						curParentDiscussComment.getChildren().add(
								curDiscussComment);
					}
				}

			}
		}

		return tree;
	}

	
	// Editing a comment
	@RequestMapping(consumes = { "application/json" })
	@ResponseBody
	public ResponseEntity<Void> submitComment(@RequestBody DiscussComment comment) {

		System.out.println("EDIT COMMENT");
		DiscussComment newComment = getComment(comment.getId());
		
		
		newComment.setStatus(comment.getStatus());
		newComment.setDiscussCommenContent(comment.getDiscussCommenContent());
		newComment.setUserId(comment.getUserId());
		newComment.setAncestorId(comment.getAncestorId());
		newComment.setAncestorOffset(comment.getAncestorOffset());
		newComment.setChildren(comment.getChildren());
		newComment.setDescendentCount(comment.getDescendentCount());
		
		newComment.setDiscussCommentCommentCount(comment.getDiscussCommentCommentCount());
		newComment.setDiscussCommentLikeCount(comment.getDiscussCommentLikeCount());
		newComment.setDiscussCommentTitle(comment.getDiscussCommentTitle());
		newComment.setDiscussId(comment.getDiscussId());
		newComment.setParentId(comment.getParentId());
		newComment.setSiblingPosition(comment.getSiblingPosition());
		
		newComment.setSubTopicId(comment.getSubTopicId());
		newComment.setTopicId(comment.getTopicId());
		
		newComment.setUserName(comment.getUserName());
		
		discussCommentRepository.save(newComment);
		ResponseEntity<Void> responseEntity = new ResponseEntity<>(
				HttpStatus.CREATED);
		System.out.println("responseEntity = " + responseEntity);
		return responseEntity;

	}
}
