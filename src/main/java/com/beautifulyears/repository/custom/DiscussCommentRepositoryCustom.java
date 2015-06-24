package com.beautifulyears.repository.custom;

import java.util.List;

import org.springframework.data.mongodb.core.query.Query;

import com.beautifulyears.domain.DiscussReply;

public interface DiscussCommentRepositoryCustom {
	public List<DiscussReply> findByDiscussType(String discussType)
			throws Exception;

	public List<DiscussReply> find(Query q, Class<DiscussReply> discussReply);

}
