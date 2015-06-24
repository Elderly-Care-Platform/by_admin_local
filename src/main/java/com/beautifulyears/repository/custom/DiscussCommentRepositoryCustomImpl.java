package com.beautifulyears.repository.custom;

import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

import com.beautifulyears.domain.DiscussReply;

public class DiscussCommentRepositoryCustomImpl implements
		DiscussCommentRepositoryCustom {
	@Autowired
	private MongoTemplate mongoTemplate;
	private Logger logger = Logger.getLogger(DiscussCommentRepositoryCustomImpl.class);

	@Override
	public List<DiscussReply> findByDiscussType(String discussType)
			throws Exception {
		Criteria criteria = Criteria.where("discussType").is(discussType);// .andOperator(Criteria.where("availability").is(1));
		return mongoTemplate.find(Query.query(criteria), DiscussReply.class);

	}

	public List<DiscussReply> find(Query q, Class<DiscussReply> class1) {
		return mongoTemplate.find(q, class1);
	}



}